import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log(response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign-in failed');
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/sign-up', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign-up failed');
  }
};

export const confirmSignUp = async (email: string, confirmation_code: string) => {
  try {
    const response = await api.post('/auth/confirm-sign-up', { email, confirmation_code });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Confirmation failed');
  }
};

export const initiatePasswordReset = async (email: string) => {
  try {
    const response = await api.post('/auth/password-reset/initiate', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to initiate password reset');
  }
};

export const confirmPasswordReset = async (
  email: string,
  confirmationCode: string,
  newPassword: string
) => {
  console.log(email, confirmationCode, newPassword)
  try {
    const response = await api.post('/auth/password-reset/confirm', {
      email,
      confirmation_code: confirmationCode,
      new_password: newPassword,
    });
    console.log(response)
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to confirm password reset'
    );
  }
};



export const getAllAssistants = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }
  try {
    const response = await api.get('/assistant/get-assistant', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assistants');
  }
};

export const getAssistantById = async (ast_id: string) => {
  console.log('Assistant Calls..')
  const token = localStorage.getItem('access_token');
  try {
    const response = await api.get(`/assistant/get-assistant/${ast_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assistant');
  }
};


// Create Assistant without file upload
export const createAssistant = async (astName: string, astInstruction: string, gptModel: string, astTools: string[]) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.post('/assistant/create-assistant', {
      astName,
      astInstruction,
      gptModel,
      astTools,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create assistant');
  }
};

// Create Assistant with file upload

export const createAssistantWithFile = async (
  astName: string,
  astInstruction: string,
  gptModel: string,
  astTools: string[],
  files: File[]
) => {
  const formData = new FormData();
  const url = `/assistant/create-assistant-with-file?astName=${encodeURIComponent(astName)}&astInstruction=${encodeURIComponent(astInstruction)}&gptModel=${encodeURIComponent(gptModel)}`;

  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  files.forEach((file) => {
    formData.append('files', file);
  });

  formData.append('astTools', JSON.stringify(astTools));

  try {
    const response = await api.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data',
      },
    });
    

    console.log('Assistant created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
};

// export const createAssistantWithFile = async (astName: string, astInstruction: string, gptModel: string, astTools: string[], files: File[]) => {
//   const token = localStorage.getItem('access_token');
//   if (!token) {
//     throw new Error('Access token not found');
//   }

//   const formData = new FormData();
//   formData.append('astName', astName);
//   formData.append('astInstruction', astInstruction);
//   formData.append('gptModel', gptModel);

//   astTools.forEach((tool, index) => {
//     formData.append(`astTools[${index}]`, tool);
//   });

//   files.forEach((file, index) => {
//     formData.append(`files[${index}]`, file);
//   });
//   console.log(formData);

//   try {
//     const response = await api.post('/assistant/create-assistant-with-file', formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Failed to create assistant with file');
//   }
// };


export const createThread = async (astId: string, threadTitle: string) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }
  try {
    const response = await api.post('/threads/create-thread', {
      astId,
      threadTitle,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create thread');
  }
};

export const createChat = async (astId: string, threadId: string, message: string, images: File[]) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  const formData = new FormData();
  formData.append('astId', astId);
  formData.append('threadId', threadId);
  formData.append('message', message);

  images.forEach((image, index) => {
    formData.append(`image[${index}]`, image);
  });

  try {
    const response = await api.post('/chats/create-chat', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data[0][0].message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create chat');
  }
};

export const getThreadsByAssistantId = async (assistant_id: string) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.get(`/threads/get-thread/${assistant_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch threads');
  }
};

export const getThreadHistoryById = async (threadId: string) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.get(`/threads/get-thread-history/${threadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch thread history');
  }
};

// Upload Assistant
export const updateAssistant = async (
  astId: string,
  astName: string,
  astInstruction: string,
  gptModel: string,
  astTools: string[]
) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Access token not found');
  }
  console.log(astId, astName, astInstruction, gptModel, astTools);

  try {
    const response = await api.put('/assistant/update-assistant', {
      astId,
      astName,
      astInstruction,
      gptModel,
      astTools,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update assistant');
  }
};

// Upload Files
export const uploadAssistantFiles = async (astId: string, files: File[]) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(`/assistant/upload-assistant-files/${astId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};











