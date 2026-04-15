import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    // clear console mocks before each test
    vi.clearAllMocks();
  });

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    
    logger.info('test message', { key: 'value' });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] test message'),
      expect.objectContaining({ key: 'value' })
    );
    
    consoleSpy.mockRestore();
  });

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    logger.error('error message', { code: 500 });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] error message'),
      expect.objectContaining({ code: 500 })
    );
    
    consoleSpy.mockRestore();
  });

  it('should log warning messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    logger.warn('warning message');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[WARN] warning message'),
      ''
    );
    
    consoleSpy.mockRestore();
  });
});
