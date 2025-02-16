import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks for API calls

// Add a new comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ patient_note_id, comment, staff_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/comments', {
        patient_note_id,
        comment,
        staff_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (comment_id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/comments/${comment_id}`);
      return comment_id; // Return the deleted comment ID for state update
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  comments: [], // Array to store comments
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Store error messages
};

// Slice
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments.push(action.payload.comment); // Add the new comment to the state
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error; // Set the error message
      })

      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload // Remove the deleted comment from the state
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error; // Set the error message
      });
  },
});

// Export actions and reducer
export const { actions } = commentSlice;
export default commentSlice.reducer;