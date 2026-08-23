IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'support' AND COLUMN_NAME = 'reply_text')
BEGIN
    ALTER TABLE [phpapp].[support] ADD [reply_text] NVARCHAR(2000) NULL;
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'support' AND COLUMN_NAME = 'replied_at')
BEGIN
    ALTER TABLE [phpapp].[support] ADD [replied_at] DATETIME NULL;
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'support' AND COLUMN_NAME = 'replied_by')
BEGIN
    ALTER TABLE [phpapp].[support] ADD [replied_by] INT NULL;
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'support' AND COLUMN_NAME = 'closed_at')
BEGIN
    ALTER TABLE [phpapp].[support] ADD [closed_at] DATETIME NULL;
END

UPDATE [phpapp].[support]
SET [closed_at] = [date_reported]
WHERE [replied_at] IS NULL AND [closed_at] IS NULL;
