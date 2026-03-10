// Custom hook to handle department chat toast notifications
import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { initializeSocket, getSocket } from '../service/socketService';
import { incrementUnread } from '../redux/slice/chatSlice';

const useDepartmentChatNotification = (dispatch) => {
  // Use window.location to check if we're on chat page (works outside Router context)
  const isChatPage = typeof window !== 'undefined' && window.location.pathname === '/shared/chat';
  const hasShownToast = useRef({});
  const currentUser = useSelector((state) => state.auth?.user || state.auth?.admin);
  const currentDepartmentId = useSelector((state) => state.departmentSwitch?.currentDepartment?.id);

  const handleDepartmentMessageNotification = useCallback((notification) => {
    // Don't show toast if we're on the chat page viewing this department
    if (isChatPage) {
      return;
    }

    // Don't show toast for our own messages
    if (notification.senderId === currentUser?.id) {
      return;
    }

    // Create unique key to prevent duplicate toasts for same message
    const toastKey = `dept-msg-${notification.id}`;
    
    // Only show toast once per message
    if (hasShownToast.current[notification.id]) {
      return;
    }
    hasShownToast.current[notification.id] = true;

    // Clean up old keys to prevent memory leaks
    const keys = Object.keys(hasShownToast.current);
    if (keys.length > 50) {
      keys.slice(0, 25).forEach(key => {
        delete hasShownToast.current[key];
      });
    }

    // Show toast notification
    const messagePreview = notification.text?.length > 50 
      ? notification.text.substring(0, 50) + '...' 
      : notification.text;

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } flex items-start gap-3 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 max-w-sm cursor-pointer hover:shadow-xl transition-shadow`}
          onClick={() => {
            toast.dismiss(t.id);
            // Use window.location for navigation since we're outside Router context
            window.location.href = '/shared/chat';
          }}
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {notification.senderDepartmentName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {notification.senderName}
            </p>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {messagePreview}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click to view in chat
            </p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
        id: toastKey
      }
    );

    // Increment unread count in Redux
    if (dispatch && notification.receiverDepartmentId) {
      dispatch(incrementUnread(notification.receiverDepartmentId));
    }
  }, [isChatPage, currentUser, dispatch]);

  useEffect(() => {
    // Only set up global handler if user is authenticated
    if (!currentUser?.id || !currentUser?.institution?.id) {
      return;
    }

    // Initialize socket with handlers if not already done
    let socket = getSocket();
    
    if (!socket) {
      socket = initializeSocket({
        token: currentUser.token,
        userId: currentUser.id,
        role: currentUser.role || 'staff',
        name: currentUser.username || `${currentUser.firstName} ${currentUser.lastName}`,
        avatar: currentUser.avatar
      }, {
        chatHandlers: {
          onDepartmentMessageNotification: handleDepartmentMessageNotification
        }
      });
    } else {
      // Update handlers if socket exists
      if (socket.chatHandlers) {
        socket.chatHandlers = {
          ...socket.chatHandlers,
          onDepartmentMessageNotification: handleDepartmentMessageNotification
        };
      } else {
        socket.chatHandlers = {
          onDepartmentMessageNotification: handleDepartmentMessageNotification
        };
      }
    }

    // Join user's department room for notifications
    if (socket && currentDepartmentId) {
      socket.emit('join-chat-room', {
        userId: currentUser.id,
        departmentId: currentDepartmentId
      });
    }

    return () => {
      // Cleanup is handled by the main app
    };
  }, [currentUser, currentDepartmentId, handleDepartmentMessageNotification]);

  return {
    handleDepartmentMessageNotification
  };
};

export default useDepartmentChatNotification;

