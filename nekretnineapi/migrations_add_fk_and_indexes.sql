IF OBJECT_ID('FK_realestate_city', 'F') IS NOT NULL
BEGIN
    ALTER TABLE [phpapp].[realestate] DROP CONSTRAINT [FK_realestate_city];
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_realestate_city')
BEGIN
    ALTER TABLE [phpapp].[realestate]
    ADD CONSTRAINT FK_realestate_city
    FOREIGN KEY ([city]) REFERENCES [phpapp].[city]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_realestate_typeobject')
BEGIN
    ALTER TABLE [phpapp].[realestate]
    ADD CONSTRAINT FK_realestate_typeobject
    FOREIGN KEY ([typeObject]) REFERENCES [phpapp].[tip_objekta]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_company_user')
BEGIN
    ALTER TABLE [phpapp].[company]
    ADD CONSTRAINT FK_company_user
    FOREIGN KEY ([fk_id]) REFERENCES [phpapp].[user]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_message_sender')
BEGIN
    ALTER TABLE [phpapp].[message]
    ADD CONSTRAINT FK_message_sender
    FOREIGN KEY ([sender_id]) REFERENCES [phpapp].[user]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_message_receiver')
BEGIN
    ALTER TABLE [phpapp].[message]
    ADD CONSTRAINT FK_message_receiver
    FOREIGN KEY ([receiver_id]) REFERENCES [phpapp].[user]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_realestate_report_user')
BEGIN
    ALTER TABLE [phpapp].[realestate_report]
    ADD CONSTRAINT FK_realestate_report_user
    FOREIGN KEY ([reported_by]) REFERENCES [phpapp].[user]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_realestate_report_realestate')
BEGIN
    ALTER TABLE [phpapp].[realestate_report]
    ADD CONSTRAINT FK_realestate_report_realestate
    FOREIGN KEY ([realestate_id]) REFERENCES [phpapp].[realestate]([id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_realestate_owner' AND object_id = OBJECT_ID('[phpapp].[realestate]'))
BEGIN
    CREATE INDEX IX_realestate_owner ON [phpapp].[realestate]([owner]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_realestate_is_active' AND object_id = OBJECT_ID('[phpapp].[realestate]'))
BEGIN
    CREATE INDEX IX_realestate_is_active ON [phpapp].[realestate]([is_active]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_message_sender' AND object_id = OBJECT_ID('[phpapp].[message]'))
BEGIN
    CREATE INDEX IX_message_sender ON [phpapp].[message]([sender_id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_message_receiver' AND object_id = OBJECT_ID('[phpapp].[message]'))
BEGIN
    CREATE INDEX IX_message_receiver ON [phpapp].[message]([receiver_id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_message_receiver_unread' AND object_id = OBJECT_ID('[phpapp].[message]'))
BEGIN
    CREATE INDEX IX_message_receiver_unread ON [phpapp].[message]([receiver_id], [is_read]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_realestate_view_viewer' AND object_id = OBJECT_ID('[phpapp].[realestate_view]'))
BEGIN
    CREATE INDEX IX_realestate_view_viewer ON [phpapp].[realestate_view]([viewer_key]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_wishlist_user' AND object_id = OBJECT_ID('[phpapp].[wishlist]'))
BEGIN
    CREATE INDEX IX_wishlist_user ON [phpapp].[wishlist]([user_id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_password_reset_user' AND object_id = OBJECT_ID('[phpapp].[password_reset_token]'))
BEGIN
    CREATE INDEX IX_password_reset_user ON [phpapp].[password_reset_token]([user_id]);
END

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_realestate_report_status' AND object_id = OBJECT_ID('[phpapp].[realestate_report]'))
BEGIN
    CREATE INDEX IX_realestate_report_status ON [phpapp].[realestate_report]([status]);
END

PRINT 'Foreign keys and indexes created successfully.';
