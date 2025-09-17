import {
  generateQRCodeDataURL,
  generateAndStorePetitionQR,
  downloadQRCode,
  validateQRCodeUrl,
  extractPetitionIdFromQR,
} from '../qr-service';
import QRCode from 'qrcode';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

// Mock dependencies
jest.mock('qrcode');
jest.mock('firebase/storage');
jest.mock('firebase/firestore');
jest.mock('../firebase');

const mockQRCodeToDataURL = QRCode.toDataURL as jest.MockedFunction<
  typeof QRCode.toDataURL
>;
const mockRef = ref as jest.MockedFunction<typeof ref>;
const mockUploadBytes = uploadBytes as jest.MockedFunction<typeof uploadBytes>;
const mockGetDownloadURL = getDownloadURL as jest.MockedFunction<
  typeof getDownloadURL
>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;

// Mock global fetch
global.fetch = jest.fn();

describe('QR Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    });
  });

  describe('generateQRCodeDataURL', () => {
    it('should generate QR code data URL', async () => {
      const petitionId = 'petition123';
      const mockDataURL = 'data:image/png;base64,mockdata';

      mockQRCodeToDataURL.mockResolvedValue(mockDataURL);

      const result = await generateQRCodeDataURL(petitionId);

      expect(mockQRCodeToDataURL).toHaveBeenCalledWith(
        'http://localhost:3000/petitions/petition123?utm_source=qr',
        expect.objectContaining({
          width: 256,
          height: 256,
          margin: 2,
        })
      );
      expect(result).toBe(mockDataURL);
    });

    it('should generate QR code with custom options', async () => {
      const petitionId = 'petition123';
      const options = {
        size: 512,
        branded: true,
        includeAnalytics: false,
      };
      const mockDataURL = 'data:image/png;base64,mockdata';

      mockQRCodeToDataURL.mockResolvedValue(mockDataURL);

      const result = await generateQRCodeDataURL(petitionId, options);

      expect(mockQRCodeToDataURL).toHaveBeenCalledWith(
        'http://localhost:3000/petitions/petition123',
        expect.objectContaining({
          width: 512,
          height: 512,
        })
      );
      expect(result).toBe(mockDataURL);
    });

    it('should handle QR generation errors', async () => {
      const petitionId = 'petition123';

      mockQRCodeToDataURL.mockRejectedValue(new Error('QR generation failed'));

      await expect(generateQRCodeDataURL(petitionId)).rejects.toThrow(
        'Failed to generate QR code'
      );
    });
  });

  describe('generateAndStorePetitionQR', () => {
    it('should generate and store QR code', async () => {
      const petitionId = 'petition123';
      const mockDataURL = 'data:image/png;base64,mockdata';
      const mockDownloadURL = 'https://storage.googleapis.com/qr-code.png';
      const mockBlob = new Blob(['mock data'], { type: 'image/png' });

      mockQRCodeToDataURL.mockResolvedValue(mockDataURL);
      (global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      });
      mockRef.mockReturnValue({} as any);
      mockUploadBytes.mockResolvedValue({} as any);
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL);
      mockDoc.mockReturnValue({} as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await generateAndStorePetitionQR(petitionId);

      expect(mockUploadBytes).toHaveBeenCalled();
      expect(mockGetDownloadURL).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(result).toBe(mockDownloadURL);
    });

    it('should handle storage errors', async () => {
      const petitionId = 'petition123';

      mockQRCodeToDataURL.mockRejectedValue(new Error('Storage failed'));

      await expect(generateAndStorePetitionQR(petitionId)).rejects.toThrow(
        'Failed to generate and store QR code'
      );
    });
  });

  describe('downloadQRCode', () => {
    it('should trigger QR code download', async () => {
      const petitionId = 'petition123';
      const petitionTitle = 'Save Our Environment';
      const mockDataURL = 'data:image/png;base64,mockdata';

      // Mock DOM elements
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };

      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      createElementSpy.mockReturnValue(mockLink as any);
      appendChildSpy.mockImplementation(() => mockLink as any);
      removeChildSpy.mockImplementation(() => mockLink as any);

      mockQRCodeToDataURL.mockResolvedValue(mockDataURL);

      await downloadQRCode(petitionId, petitionTitle);

      expect(mockLink.href).toBe(mockDataURL);
      expect(mockLink.download).toBe('save_our_environment_qr_code.png');
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('validateQRCodeUrl', () => {
    it('should validate correct petition URLs', () => {
      const validUrls = [
        'https://3arida.ma/petitions/petition123',
        'http://localhost:3000/petitions/abc-def-123',
        'https://example.com/petitions/test-petition-456',
      ];

      validUrls.forEach((url) => {
        expect(validateQRCodeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'https://3arida.ma/users/user123',
        'https://example.com/admin/dashboard',
        'not-a-url',
        'https://3arida.ma/petition/missing-s',
      ];

      invalidUrls.forEach((url) => {
        expect(validateQRCodeUrl(url)).toBe(false);
      });
    });
  });

  describe('extractPetitionIdFromQR', () => {
    it('should extract petition ID from URL', () => {
      const testCases = [
        {
          url: 'https://3arida.ma/petitions/save-environment-abc12345',
          expected: 'abc12345',
        },
        {
          url: 'http://localhost:3000/petitions/test-petition-xyz98765',
          expected: 'xyz98765',
        },
      ];

      testCases.forEach(({ url, expected }) => {
        const result = extractPetitionIdFromQR(url);
        expect(result).toBe(expected);
      });
    });

    it('should return null for invalid URLs', () => {
      const invalidUrls = [
        'https://3arida.ma/users/user123',
        'not-a-url',
        'https://3arida.ma/petitions/no-id-here',
        'https://3arida.ma/petitions/short-id-123', // ID too short
      ];

      invalidUrls.forEach((url) => {
        expect(extractPetitionIdFromQR(url)).toBeNull();
      });
    });
  });
});
