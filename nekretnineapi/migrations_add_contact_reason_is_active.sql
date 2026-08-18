IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp'
                 AND TABLE_NAME = 'contact_reason'
                 AND COLUMN_NAME = 'is_active')
BEGIN
    ALTER TABLE [phpapp].[contact_reason]
    ADD [is_active] BIT NOT NULL CONSTRAINT DF_contact_reason_is_active DEFAULT (1);
END
