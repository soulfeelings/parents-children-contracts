package com.parentchildcontracts

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.content.Context
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            var isLoading by remember { mutableStateOf(true) }
            
            Box(modifier = Modifier.fillMaxSize()) {
                AndroidView(
                    factory = { context ->
                        WebView(context).apply {
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                setAppCacheEnabled(true)
                                loadWithOverviewMode = true
                                useWideViewPort = true
                            }

                            webViewClient = object : WebViewClient() {
                                override fun onPageFinished(view: WebView?, url: String?) {
                                    isLoading = false
                                }
                            }

                            // Добавляем интерфейс для взаимодействия между JavaScript и Android
                            addJavascriptInterface(WebAppInterface(context), "Android")

                            // В режиме разработки загружаем с локального сервера
                            loadUrl("http://10.0.2.2:3000")
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )

                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
            }
        }
    }
}

class WebAppInterface(private val context: Context) {
    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun getFromStorage(key: String): String {
        val prefs = context.getSharedPreferences("WebAppPrefs", Context.MODE_PRIVATE)
        return prefs.getString(key, "") ?: ""
    }

    @JavascriptInterface
    fun saveToStorage(key: String, value: String) {
        val prefs = context.getSharedPreferences("WebAppPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString(key, value).apply()
    }
} 