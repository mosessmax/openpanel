import {
  type IChartBreakdown,
  type IChartEvent,
  type IInterval,
} from "@/types";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  events: IChartEvent[];
  breakdowns: IChartBreakdown[];
  interval: IInterval;
  startDate: Date;
  endDate: Date;
};

// First approach: define the initial state using that type
const initialState: InitialState = {
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  endDate: new Date(),
  interval: "day",
  breakdowns: [
    {
      id: "A",
      name: "properties.params.title",
    },
  ],
  events: [
    {
      id: "A",
      displayName: "screen_view (0)",
      name: "screen_view",
      filters: [
        {
          id: "1",
          name: "properties.route",
          value: "RecipeDetails",
        },
      ],
    },
  ],
};

const IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;

export const reportSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // Events
    addEvent: (state, action: PayloadAction<Omit<IChartEvent, "id">>) => {
      state.events.push({
        id: IDS[state.events.length]!,
        ...action.payload,
      });
    },
    removeEvent: (
      state,
      action: PayloadAction<{
        id: string;
      }>,
    ) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload.id,
      );
    },
    changeEvent: (state, action: PayloadAction<IChartEvent>) => {
      state.events = state.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
    },

    // Breakdowns
    addBreakdown: (
      state,
      action: PayloadAction<Omit<IChartBreakdown, "id">>,
    ) => {
      state.breakdowns.push({
        id: IDS[state.breakdowns.length]!,
        ...action.payload,
      });
    },
    removeBreakdown: (
      state,
      action: PayloadAction<{
        id: string;
      }>,
    ) => {
      state.breakdowns = state.breakdowns.filter(
        (event) => event.id !== action.payload.id,
      );
    },
    changeBreakdown: (state, action: PayloadAction<IChartBreakdown>) => {
      state.breakdowns = state.breakdowns.map((breakdown) => {
        if (breakdown.id === action.payload.id) {
          return action.payload;
        }
        return breakdown;
      });
    },

    // Interval
    changeInterval: (state, action: PayloadAction<IInterval>) => {
      state.interval = action.payload;
    },

    // Date range
    changeStartDate: (state, action: PayloadAction<Date>) => {
      state.startDate = action.payload;
    },

    // Date range
    changeEndDate: (state, action: PayloadAction<Date>) => {
      state.endDate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addEvent,
  removeEvent,
  changeEvent,
  addBreakdown,
  removeBreakdown,
  changeBreakdown,
  changeInterval,
} = reportSlice.actions;

export default reportSlice.reducer;