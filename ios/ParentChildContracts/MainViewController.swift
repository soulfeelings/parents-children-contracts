import UIKit
import WebKit

class MainViewController: UIViewController {
    private lazy var webView: WKWebView = {
        let configuration = WKWebViewConfiguration()
        
        // Настраиваем JavaScript интерфейс
        let contentController = WKUserContentController()
        contentController.add(self, name: "iOS")
        configuration.userContentController = contentController
        
        // Включаем поддержку localStorage и других веб-функций
        configuration.websiteDataStore = .default()
        configuration.preferences.javaScriptEnabled = true
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.navigationDelegate = self
        return webView
    }()
    
    private lazy var loadingIndicator: UIActivityIndicatorView = {
        let indicator = UIActivityIndicatorView(style: .large)
        indicator.translatesAutoresizingMaskIntoConstraints = false
        indicator.hidesWhenStopped = true
        return indicator
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadWebContent()
    }
    
    private func setupUI() {
        view.backgroundColor = .white
        
        view.addSubview(webView)
        view.addSubview(loadingIndicator)
        
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        
        loadingIndicator.startAnimating()
    }
    
    private func loadWebContent() {
        // В режиме разработки используем localhost
        guard let url = URL(string: "http://localhost:3000") else { return }
        let request = URLRequest(url: url)
        webView.load(request)
    }
}

// MARK: - WKNavigationDelegate
extension MainViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingIndicator.stopAnimating()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        loadingIndicator.stopAnimating()
        // Здесь можно добавить обработку ошибок
    }
}

// MARK: - WKScriptMessageHandler
extension MainViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any] else { return }
        
        switch message.name {
        case "iOS":
            handleJavaScriptMessage(dict)
        default:
            break
        }
    }
    
    private func handleJavaScriptMessage(_ message: [String: Any]) {
        guard let type = message["type"] as? String else { return }
        
        switch type {
        case "showToast":
            if let text = message["text"] as? String {
                showToast(text)
            }
        case "saveToStorage":
            if let key = message["key"] as? String,
               let value = message["value"] as? String {
                UserDefaults.standard.set(value, forKey: key)
            }
        case "getFromStorage":
            if let key = message["key"] as? String {
                let value = UserDefaults.standard.string(forKey: key) ?? ""
                // Отправляем значение обратно в JavaScript
                sendToJavaScript(["type": "storageValue", "key": key, "value": value])
            }
        default:
            break
        }
    }
    
    private func showToast(_ text: String) {
        let alert = UIAlertController(title: nil, message: text, preferredStyle: .alert)
        present(alert, animated: true)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            alert.dismiss(animated: true)
        }
    }
    
    private func sendToJavaScript(_ message: [String: Any]) {
        if let jsonData = try? JSONSerialization.data(withJSONObject: message),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            webView.evaluateJavaScript("window.dispatchEvent(new CustomEvent('iOSMessage', { detail: \(jsonString) }));")
        }
    }
} 