import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reward {
  type: "money" | "privilege" | "item";
  value: string;
  amount?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
  dueDate?: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  parentId: string;
  childId: string;
  reward: Reward;
  tasks: Task[];
  status: "active" | "completed" | "failed" | "pending";
  createdAt: string;
  updatedAt: string;
}

interface ContractsState {
  items: Contract[];
  isLoading: boolean;
  error: string | null;
  selectedContract: Contract | null;
}

const initialState: ContractsState = {
  items: [],
  isLoading: false,
  error: null,
  selectedContract: null,
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setContracts: (state, action: PayloadAction<Contract[]>) => {
      state.items = action.payload;
    },
    addContract: (state, action: PayloadAction<Contract>) => {
      state.items.push(action.payload);
    },
    updateContract: (state, action: PayloadAction<Contract>) => {
      const index = state.items.findIndex(
        (contract) => contract.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (contract) => contract.id !== action.payload
      );
    },
    setSelectedContract: (state, action: PayloadAction<Contract | null>) => {
      state.selectedContract = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setContracts,
  addContract,
  updateContract,
  deleteContract,
  setSelectedContract,
  setLoading,
  setError,
} = contractsSlice.actions;

export default contractsSlice.reducer;
