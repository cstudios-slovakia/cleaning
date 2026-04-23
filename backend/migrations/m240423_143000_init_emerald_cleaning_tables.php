<?php

use yii\db\Migration;

/**
 * Class m240423_143000_init_emerald_cleaning_tables
 */
class m240423_143000_init_emerald_cleaning_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        // Users table
        $this->createTable('{{%users}}', [
            'id' => $this->primaryKey(),
            'username' => $this->string()->notNull()->unique(),
            'password_hash' => $this->string()->null(), // For managers/admins
            'pin_hash' => $this->string()->null(), // For cleaners
            'role' => $this->string(32)->notNull(), // admin, manager, cleaner
            'language' => $this->string(10)->defaultValue('en'),
            'status' => $this->smallInteger()->notNull()->defaultValue(10), // 10 = active, 0 = inactive
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);

        // Properties table
        $this->createTable('{{%properties}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'theme_color' => $this->string(7)->null(), // e.g., #FFFFFF
            'cover_image' => $this->string()->null(),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);

        // User_Properties mapping (Many-to-Many)
        $this->createTable('{{%user_properties}}', [
            'user_id' => $this->integer()->notNull(),
            'property_id' => $this->integer()->notNull(),
        ]);
        $this->addPrimaryKey('pk-user_properties', '{{%user_properties}}', ['user_id', 'property_id']);
        $this->addForeignKey('fk-user_properties-user_id', '{{%user_properties}}', 'user_id', '{{%users}}', 'id', 'CASCADE');
        $this->addForeignKey('fk-user_properties-property_id', '{{%user_properties}}', 'property_id', '{{%properties}}', 'id', 'CASCADE');

        // Rooms table
        $this->createTable('{{%rooms}}', [
            'id' => $this->primaryKey(),
            'property_id' => $this->integer()->notNull(),
            'name' => $this->string()->notNull(),
            'deadline_time' => $this->time()->null(), // e.g., "14:00:00"
            'notes' => $this->text()->null(), // Note for next shift
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);
        $this->addForeignKey('fk-rooms-property_id', '{{%rooms}}', 'property_id', '{{%properties}}', 'id', 'CASCADE');

        // Tasks/Checklists table
        $this->createTable('{{%tasks}}', [
            'id' => $this->primaryKey(),
            'room_id' => $this->integer()->notNull(),
            'description' => $this->string()->notNull(),
            'is_completed' => $this->boolean()->defaultValue(false),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);
        $this->addForeignKey('fk-tasks-room_id', '{{%tasks}}', 'room_id', '{{%rooms}}', 'id', 'CASCADE');

        // Cleanings table
        $this->createTable('{{%cleanings}}', [
            'id' => $this->primaryKey(),
            'room_id' => $this->integer()->notNull(),
            'date' => $this->date()->notNull(),
            'status' => $this->string(32)->notNull()->defaultValue('waiting'), // waiting, cleaned
            'cleaner_id' => $this->integer()->null(), // Who cleaned it
            'finished_at' => $this->integer()->null(), // Timestamp when cleaned
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ]);
        $this->addForeignKey('fk-cleanings-room_id', '{{%cleanings}}', 'room_id', '{{%rooms}}', 'id', 'CASCADE');
        $this->addForeignKey('fk-cleanings-cleaner_id', '{{%cleanings}}', 'cleaner_id', '{{%users}}', 'id', 'SET NULL');
        
        // Damage Reports table
        $this->createTable('{{%damage_reports}}', [
            'id' => $this->primaryKey(),
            'room_id' => $this->integer()->notNull(),
            'reported_by' => $this->integer()->notNull(), // Cleaner ID
            'description' => $this->text()->notNull(),
            'photo_url' => $this->string()->null(),
            'created_at' => $this->integer()->notNull(),
        ]);
        $this->addForeignKey('fk-damage-room_id', '{{%damage_reports}}', 'room_id', '{{%rooms}}', 'id', 'CASCADE');
        $this->addForeignKey('fk-damage-reported_by', '{{%damage_reports}}', 'reported_by', '{{%users}}', 'id', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%damage_reports}}');
        $this->dropTable('{{%cleanings}}');
        $this->dropTable('{{%tasks}}');
        $this->dropTable('{{%rooms}}');
        $this->dropTable('{{%user_properties}}');
        $this->dropTable('{{%properties}}');
        $this->dropTable('{{%users}}');
    }
}
