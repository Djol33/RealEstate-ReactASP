IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'phpapp' AND TABLE_NAME = 'realestate' AND COLUMN_NAME = 'show_map')
BEGIN
    ALTER TABLE [phpapp].[realestate]
    ADD [show_map] BIT NOT NULL CONSTRAINT DF_realestate_show_map DEFAULT (1);
END
