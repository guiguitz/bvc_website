-- Table: Cases
CREATE TABLE IF NOT EXISTS Cases (
    CaseID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    CPF TEXT NOT NULL,
    RG TEXT NOT NULL,
    Address TEXT NOT NULL,
    Profession TEXT,
    Phone TEXT,
    Email TEXT,
    CivilStatus TEXT,
    BankDetails TEXT,
    BirthDate TEXT,
    Organization TEXT,
    CaseDescription TEXT,
    ProcessNumber TEXT UNIQUE,
    JusticeScopeID INTEGER NOT NULL,
    DemandTypeID INTEGER NOT NULL,
    StatusID INTEGER NOT NULL,
    FOREIGN KEY (JusticeScopeID) REFERENCES JusticeScopes(JusticeScopeID),
    FOREIGN KEY (DemandTypeID) REFERENCES DemandTypes(DemandTypeID),
    FOREIGN KEY (StatusID) REFERENCES CaseStatuses(CaseStatusID)
);

-- Table: Deadlines
CREATE TABLE IF NOT EXISTS Deadlines (
    DeadlineID INTEGER PRIMARY KEY AUTOINCREMENT,
    CaseID INTEGER NOT NULL,
    DeadlineTypeID INTEGER NOT NULL,
    DeadlineDate TEXT NOT NULL,
    StatusID INTEGER NOT NULL,
    UNIQUE (CaseID, DeadlineTypeID, DeadlineDate), -- Prevent duplicate deadlines for the same case
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID),
    FOREIGN KEY (DeadlineTypeID) REFERENCES DeadlineTypes(DeadlineTypeID),
    FOREIGN KEY (StatusID) REFERENCES DeadlineStatuses(DeadlineStatusID)
);

-- Table: Fees
CREATE TABLE IF NOT EXISTS Fees (
    FeeID INTEGER PRIMARY KEY AUTOINCREMENT,
    CaseID INTEGER NOT NULL,
    FeeTypeID INTEGER NOT NULL,
    FeeValue REAL NOT NULL,
    FeeStatusID INTEGER NOT NULL,
    UNIQUE (CaseID, FeeTypeID, FeeValue), -- Prevent duplicate deadlines for the same case
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID),
    FOREIGN KEY (FeeTypeID) REFERENCES FeeTypes(FeeTypeID),
    FOREIGN KEY (FeeStatusID) REFERENCES FeeStatuses(FeeStatusID)
);

-- Table: JusticeScopes
CREATE TABLE IF NOT EXISTS JusticeScopes (
    JusticeScopeID INTEGER PRIMARY KEY AUTOINCREMENT,
    ScopeName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO JusticeScopes (ScopeName) VALUES
('Civil'), ('Trabalhista'), ('Penal (Criminal)'), ('Empresarial (Comercial)'),
('Tributário'), ('Administrativo'), ('Constitucional'), ('Eleitoral'),
('Previdenciário'), ('Ambiental'), ('Internacional'), ('Militar'),
('Digital'), ('do Consumidor'), ('Médico e da Saúde');

-- Table: DemandTypes
CREATE TABLE IF NOT EXISTS DemandTypes (
    DemandTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    DemandName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DemandTypes (DemandName) VALUES
('Petição inicial'), ('Contestação'), ('Notificação Extrajudicial'), ('Contratos');

-- Table: CaseStatuses
CREATE TABLE IF NOT EXISTS CaseStatuses (
    CaseStatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    StatusName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO CaseStatuses (StatusName) VALUES
('Ativo'), ('Arquivado');

-- Table: DeadlineTypes
CREATE TABLE IF NOT EXISTS DeadlineTypes (
    DeadlineTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    TypeName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DeadlineTypes (TypeName) VALUES
('Reunião'), ('Petição Inicial'), ('Notificação Extrajudicial'), ('Contrato'),
('Defesa'), ('Impugnação'), ('Recurso'), ('E-mail'), ('Manifestação'),
('Audiência Conciliação'), ('Audiência de Instrução'), ('Sentença');

-- Table: DeadlineStatuses
CREATE TABLE IF NOT EXISTS DeadlineStatuses (
    DeadlineStatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    StatusName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DeadlineStatuses (StatusName) VALUES
('Entregue'), ('Pedente'), ('Trânsito em Julgado'), ('Aguardando');

-- Table: FeeTypes
CREATE TABLE IF NOT EXISTS FeeTypes (
    FeeTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    TypeName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO FeeTypes (TypeName) VALUES
('Inicial'), ('Êxito');

-- Table: FeeStatuses
CREATE TABLE IF NOT EXISTS FeeStatuses (
    FeeStatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    StatusName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO FeeStatuses (StatusName) VALUES
('Pago'), ('Pendente');

-- Insert sample data into Cases for debugging purposes
INSERT OR IGNORE INTO Cases (Name, CPF, RG, Address, Profession, Phone, Email, CivilStatus, BankDetails, BirthDate, Organization, CaseDescription, ProcessNumber, JusticeScopeID, DemandTypeID, StatusID)
VALUES
('John Doe', '123.456.789-00', 'MG-12.345.678', '123 Main St, Cityville', 'Engineer', '555-1234', 'johndoe@example.com', 'Single', 'Bank XYZ - Account 12345', '1985-06-15', 'Polícia Federal', 'Case regarding property dispute', 'PN-001', 1, 1, 1),
('Jane Smith', '987.654.321-00', 'SP-98.765.432', '456 Elm St, Townsville', 'Doctor', '555-5678', 'janesmith@example.com', 'Married', 'Bank ABC - Account 67890', '1990-03-22', 'Polícia Federal', 'Case regarding medical malpractice', 'PN-002', 2, 2, 1),
('Alice Johnson', '111.222.333-44', 'RJ-11.223.344', '789 Oak St, Villagetown', 'Teacher', '555-9012', 'alicejohnson@example.com', 'Divorced', 'Bank DEF - Account 11223', '1978-11-05', 'Polícia Federal', 'Case regarding labor rights', 'PN-003', 3, 3, 2),
('Carlos Silva', '222.333.444-55', 'SP-22.334.455', '101 Pine St, Metropolis', 'Lawyer', '555-2345', 'carlossilva@example.com', 'Married', 'Bank GHI - Account 33445', '1980-02-10', 'Ministério Público', 'Case regarding contract dispute', 'PN-004', 4, 1, 1),
('Maria Oliveira', '333.444.555-66', 'RJ-33.445.566', '202 Maple St, Capital City', 'Architect', '555-3456', 'mariaoliveira@example.com', 'Single', 'Bank JKL - Account 44556', '1992-07-19', 'Defensoria Pública', 'Case regarding environmental issues', 'PN-005', 5, 2, 2),
('Pedro Santos', '444.555.666-77', 'MG-44.556.677', '303 Birch St, Smalltown', 'Accountant', '555-4567', 'pedrosantos@example.com', 'Widowed', 'Bank MNO - Account 55667', '1975-09-30', 'Tribunal de Justiça', 'Case regarding tax evasion', 'PN-006', 6, 3, 1),
('Ana Costa', '555.666.777-88', 'BA-55.667.788', '404 Cedar St, Bigcity', 'Nurse', '555-5678', 'anacosta@example.com', 'Divorced', 'Bank PQR - Account 66778', '1988-12-25', 'Polícia Federal', 'Case regarding medical negligence', 'PN-007', 7, 4, 2);

-- Insert sample data into Deadlines for debugging purposes
INSERT OR IGNORE INTO Deadlines (CaseID, DeadlineTypeID, DeadlineDate, StatusID)
VALUES
(1, 1, '2023-11-01', 1), -- Reunião for John Doe's case
(1, 2, '2023-11-15', 2), -- Petição Inicial for John Doe's case
(2, 3, '2023-12-01', 3), -- Notificação Extrajudicial for Jane Smith's case
(3, 4, '2023-12-10', 4), -- Contrato for Alice Johnson's case
(4, 5, '2023-11-20', 1), -- Defesa for Carlos Silva's case
(4, 6, '2023-12-05', 2), -- Impugnação for Carlos Silva's case
(5, 7, '2023-12-15', 3), -- Recurso for Maria Oliveira's case
(6, 8, '2023-12-20', 4), -- E-mail for Pedro Santos's case
(7, 9, '2024-01-10', 1), -- Manifestação for Ana Costa's case
(7, 10, '2024-01-25', 2); -- Audiência Conciliação for Ana Costa's case

-- Insert sample data into Fees for debugging purposes
INSERT OR IGNORE INTO Fees (CaseID, FeeTypeID, FeeValue, FeeStatusID)
VALUES
(1, 1, 500.00, 1), -- Fee for John Doe's case
(1, 2, 200.00, 2), -- Fee for John Doe's case
(2, 1, 700.00, 1), -- Fee for Jane Smith's case
(3, 1, 300.00, 2), -- Fee for Alice Johnson's case
(4, 1, 800.00, 1), -- Fee for Carlos Silva's case
(4, 2, 300.00, 2), -- Fee for Carlos Silva's case
(5, 1, 1000.00, 1), -- Fee for Maria Oliveira's case
(6, 2, 400.00, 2), -- Fee for Pedro Santos's case
(7, 1, 600.00, 1), -- Fee for Ana Costa's case
(7, 2, 250.00, 2); -- Fee for Ana Costa's case
