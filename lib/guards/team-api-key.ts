import { getApiKeyById } from 'models/apiKey';
import { ApiError } from '../errors';

export const throwIfNoAccessToApiKey = async (
  apiKeyId: string,
  userId: string
) => {
  const apiKey = await getApiKeyById(apiKeyId);

  if (!apiKey) {
    throw new ApiError(404, 'API key not found');
  }

  if (userId !== apiKey.userId) {
    throw new ApiError(
      403,
      'You do not have permission to delete this API key'
    );
  }
};
