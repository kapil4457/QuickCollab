import { createSlice } from "@reduxjs/toolkit";
import type {
  Dispatch,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { loggedInUser } from "../dtos/response/LoginResponseDTO";
import { ContentCreatorJobPost, OfferDetail } from "../dtos/helper";

// Define a type for the slice state
export interface UserState {
  user: loggedInUser | null;
  jwtToken: string;
  loading: boolean;
}

export let dispatchType: ThunkDispatch<
  {
    user: UserState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

const initialState: UserState = {
  user: null,
  jwtToken: "",
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.loading = action.payload.loading;
      state.jwtToken = action.payload.jwtToken;
    },
    updateUserLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updatePostedJobs: (
      state,
      action: PayloadAction<ContentCreatorJobPost[]>
    ) => {
      if (state.user && "jobsPosted" in state.user) {
        state.user.jobsPosted = action.payload;
      }
    },
  },
});

export const { updateUser, updateUserLoadingState, updatePostedJobs } =
  userSlice.actions;

export const selectJwtToken = (state: RootState) => state.user.jwtToken;
export const selectUserLoadingState = (state: RootState) => state.user.loading;
export const selectLoggedInUser = (state: RootState) => state.user.user;
export const selectPostedJobs = (state: RootState) => {
  if (state.user.user && "jobsPosted" in state.user.user) {
    return state.user.user.jobsPosted;
  }
  return [];
};
export const selectAppliedJobs = (state: RootState) => {
  if (state.user.user && "appliedJobs" in state.user.user) {
    return state.user.user.appliedJobs;
  }
  return [];
};
export const selectOffersRecieved = (state: RootState) => {
  if (state.user.user && "offersReceived" in state.user.user) {
    return state.user.user.offersReceived;
  }
  return [];
};

export const selectAllJobsOffered = (state: RootState) => {
  if (state.user.user && "jobsPosted" in state.user.user) {
    let offeredTo: Array<OfferDetail> = [];
    state.user.user.jobsPosted.map((job) => {
      offeredTo = offeredTo.concat(job.offeredTo);
    });
    return offeredTo;
  }
  return [];
};
export const selectCurrentJob = (state: RootState) => {
  if (state.user.user && "currentJobDetails" in state.user.user) {
    return state.user.user.currentJobDetails;
  }
  return null;
};
export const selectMyEmployees = (state: RootState) => {
  if (state.user.user && "employees" in state.user.user) {
    return state.user.user.employees;
  }
  return [];
};
export const selectCurrentJobDetails = (state: RootState) => {
  if (state.user.user && "currentJobDetails" in state.user.user) {
    return state.user.user.currentJobDetails;
  }
  return null;
};
export const selectWorkHistory = (state: RootState) => {
  if (state.user.user && "jobHistory" in state.user.user) {
    return state.user.user.jobHistory;
  }
  return [];
};

export const selectReportsTo = (state: RootState) => {
  if (state.user.user && "reportsTo" in state.user.user) {
    return state.user.user.reportsTo;
  }
  return null;
};
export const selectNoticePeriodEndDate = (state: RootState) => {
  if (state.user.user && "noticePeriodEndDate" in state.user.user) {
    return state.user.user.noticePeriodEndDate;
  }
  return null;
};
export const selectIsServingNoticePeriod = (state: RootState) => {
  if (state.user.user && "isServingNoticePeriod" in state.user.user) {
    return state.user.user.isServingNoticePeriod;
  }
  return null;
};
export const selectPersonalProjects = (state: RootState) => {
  if (state.user.user && "personalProjects" in state.user.user) {
    return state.user.user.personalProjects;
  }
  return [];
};
export const selectEmployeesCount = (state: RootState) => {
  if (state.user.user && "employees" in state.user.user) {
    return state.user.user.employees.length;
  }
  return 0;
};
export const selectEmployeesOnNoticePeriodCount = (state: RootState) => {
  if (state.user.user && "employees" in state.user.user) {
    return state.user.user.employees.filter(
      (employee) => employee.isServingNoticePeriod
    ).length;
  }
  return 0;
};

export const selectTotalSalaryPaid = (state: RootState) => {
  if (state.user.user && "employees" in state.user.user) {
    let salary = 0;
    state.user.user.employees.forEach((employee) => {
      salary += employee.currentSalary;
    });
    return salary;
  }
  return 0;
};
export const selectConfiguredProviders = (state: RootState) => {
  if (state.user.user && "providers" in state.user.user) {
    return state.user.user.providers;
  }
  return [];
};

export const selectAllUploadRequests = (state: RootState) => {
  if (state.user.user && "uploadRequests" in state.user.user) {
    return state.user.user.uploadRequests;
  }
  return [];
};
export const selectUploadRequestMappings = (state: RootState) => {
  if (state.user.user && "availableContentTypes" in state.user.user) {
    return state.user.user.availableContentTypes;
  }
  return [];
};
export default userSlice.reducer;
