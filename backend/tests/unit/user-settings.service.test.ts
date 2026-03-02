import { UserSettingsService } from '../../src/services/user-settings.service';
import { userSettingsRepository } from '../../src/repositories/user-settings.repository';
import { HttpError } from '../../src/errors/http-error';

jest.mock('../../src/repositories/user-settings.repository');

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    service = new UserSettingsService();
    jest.clearAllMocks();
  });

  it('should get settings or create default if not exist', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce(null);
    (userSettingsRepository.createSettings as jest.Mock).mockResolvedValueOnce({ userId: '1', emailNotifications: true });
    const result = await service.getSettings('1');
    expect(result).toEqual({ userId: '1', emailNotifications: true });
  });

  it('should update settings', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '1' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({ userId: '1', emailNotifications: false });
    const result = await service.updateSettings('1', { emailNotifications: false });
    expect(result).toEqual({ userId: '1', emailNotifications: false });
  });

  it('should throw if update fails', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '1' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.updateSettings('1', { emailNotifications: false })).rejects.toThrow(HttpError);
  });

  it('should update general settings', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '2' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({ userId: '2', language: 'en', timezone: 'UTC' });
    const result = await service.updateGeneralSettings('2', { language: 'en', timezone: 'UTC' });
    expect(result).toEqual({ userId: '2', language: 'en', timezone: 'UTC' });
  });

  it('should update privacy settings', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '3' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({ userId: '3', profileVisibility: 'private' });
    const result = await service.updatePrivacySettings('3', { profileVisibility: 'private' });
    expect(result).toEqual({ userId: '3', profileVisibility: 'private' });
  });

  it('should update notification settings', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '4' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({
      userId: '4',
      emailNotifications: true,
      notificationFrequency: 'daily',
      notifyAchievements: true,
      notifyRecommendations: false,
      notifyAnnouncements: true,
    });
    const result = await service.updateNotificationSettings('4', {
      emailNotifications: true,
      notificationFrequency: 'daily',
      notifyAchievements: true,
      notifyRecommendations: false,
      notifyAnnouncements: true,
    });
    expect(result).toEqual({
      userId: '4',
      emailNotifications: true,
      notificationFrequency: 'daily',
      notifyAchievements: true,
      notifyRecommendations: false,
      notifyAnnouncements: true,
    });
  });

  it('should update appearance settings', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '5' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({
      userId: '5',
      theme: 'dark',
      accentColor: '#000',
      fontSize: 'large',
      reduceMotion: true,
    });
    const result = await service.updateAppearanceSettings('5', {
      theme: 'dark',
      accentColor: '#000',
      fontSize: 'large',
      reduceMotion: true,
    });
    expect(result).toEqual({
      userId: '5',
      theme: 'dark',
      accentColor: '#000',
      fontSize: 'large',
      reduceMotion: true,
    });
  });

  it('should update data preferences', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '6' });
    (userSettingsRepository.updateSettings as jest.Mock).mockResolvedValueOnce({
      userId: '6',
      dataCollection: false,
    });
    const result = await service.updateDataPreferences('6', false);
    expect(result).toEqual({
      userId: '6',
      dataCollection: false,
    });
  });

  it('should throw HttpError if getSettings throws', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(service.getSettings('7')).rejects.toThrow(HttpError);
  });

  it('should throw HttpError if updateSettings throws unexpected error', async () => {
    (userSettingsRepository.getSettingsByUserId as jest.Mock).mockResolvedValueOnce({ userId: '8' });
    (userSettingsRepository.updateSettings as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(service.updateSettings('8', { emailNotifications: true })).rejects.toThrow(HttpError);
  });
});