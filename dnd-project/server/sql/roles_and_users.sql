INSERT INTO roles (name) VALUES ('dungeon master');
INSERT INTO roles (name) VALUES ('player');
INSERT INTO users (name, password, role_id) VALUES ('Septino', '$2b$10$BuL9/p5lxnMvpb65lvnGsOepxqyETGcJxX9MuerGZAnACJjFDSDaO', (SELECT r.id FROM roles r WHERE r.name = 'dungeon master'));
INSERT INTO users (name, password, role_id) VALUES ('Yuuna', '$2b$10$McrxcBsd8v5YjWsuuEom4es1.UNUxh4vPdvt.aouGudPV/vZJQPWG', (SELECT r.id FROM roles r WHERE r.name = 'player'));
INSERT INTO users (name, password, role_id) VALUES ('Zange', '$2b$10$McrxcBsd8v5YjWsuuEom4es1.UNUxh4vPdvt.aouGudPV/vZJQPWG', (SELECT r.id FROM roles r WHERE r.name = 'player'));
INSERT INTO users (name, password, role_id) VALUES ('Lemon', '$2b$10$McrxcBsd8v5YjWsuuEom4es1.UNUxh4vPdvt.aouGudPV/vZJQPWG', (SELECT r.id FROM roles r WHERE r.name = 'player'));
INSERT INTO users (name, password, role_id) VALUES ('Polar', '$2b$10$McrxcBsd8v5YjWsuuEom4es1.UNUxh4vPdvt.aouGudPV/vZJQPWG', (SELECT r.id FROM roles r WHERE r.name = 'player'));
INSERT INTO users (name, password, role_id) VALUES ('Erik', '$2b$10$McrxcBsd8v5YjWsuuEom4es1.UNUxh4vPdvt.aouGudPV/vZJQPWG', (SELECT r.id FROM roles r WHERE r.name = 'player'));