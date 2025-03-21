-- Table: Cases
-- Stores information about legal cases, including client details, case description, and related metadata.
CREATE TABLE IF NOT EXISTS Cases (
    CaseID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    CPF TEXT NOT NULL,
    RG TEXT NOT NULL,
    Address TEXT NOT NULL,
    Profession TEXT,
    Phone TEXT UNIQUE,
    Email TEXT UNIQUE,
    CivilStatus TEXT,
    BankDetails TEXT,
    BirthDate TEXT,
    Organization TEXT,
    CaseDescription TEXT,
    ProcessNumber TEXT UNIQUE,
    Observations TEXT,
    JusticeScopeID INTEGER NOT NULL,
    DemandTypeID INTEGER NOT NULL,
    StatusID INTEGER NOT NULL,
    FOREIGN KEY (JusticeScopeID) REFERENCES JusticeScope(JusticeScopeID),
    FOREIGN KEY (DemandTypeID) REFERENCES DemandType(DemandTypeID),
    FOREIGN KEY (StatusID) REFERENCES CaseStatus(CaseStatusID)
);

-- Table: Deadlines
-- Tracks deadlines associated with cases, including the type of deadline, date, and status.
CREATE TABLE IF NOT EXISTS Deadlines (
    DeadlineID INTEGER PRIMARY KEY AUTOINCREMENT,
    CaseID INTEGER NOT NULL,
    DeadlineTypeID INTEGER NOT NULL,
    DeadlineDate TEXT NOT NULL,
    StatusID INTEGER NOT NULL,
    UNIQUE (CaseID, DeadlineTypeID, DeadlineDate), -- Prevent duplicate deadlines for the same case
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID),
    FOREIGN KEY (DeadlineTypeID) REFERENCES DeadlineType(DeadlineTypeID),
    FOREIGN KEY (StatusID) REFERENCES DeadlineStatus(DeadlineStatusID)
);

-- Table: Fees
-- Manages financial details related to cases, such as fee type, value, and status.
CREATE TABLE IF NOT EXISTS Fees (
    FeeID INTEGER PRIMARY KEY AUTOINCREMENT,
    CaseID INTEGER NOT NULL,
    FeeType TEXT NOT NULL,
    FeeValue REAL NOT NULL,
    FeeStatus TEXT NOT NULL,
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID)
);

-- Table: JusticeScope
-- Defines the scope of justice for cases, such as Civil, Trabalhista, Penal, etc.
CREATE TABLE IF NOT EXISTS JusticeScope (
    JusticeScopeID INTEGER PRIMARY KEY AUTOINCREMENT,
    ScopeName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO JusticeScope (ScopeName) VALUES
('Civil'), ('Trabalhista'), ('Penal (Criminal)'), ('Empresarial (Comercial)'),
('Tributário'), ('Administrativo'), ('Constitucional'), ('Eleitoral'),
('Previdenciário'), ('Ambiental'), ('Internacional'), ('Militar'),
('Digital'), ('do Consumidor'), ('Médico e da Saúde');

-- Table: DemandType
-- Specifies the type of legal demand, such as Petição Inicial, Contestação, etc.
CREATE TABLE IF NOT EXISTS DemandType (
    DemandTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    DemandName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DemandType (DemandName) VALUES
('Petição inicial'), ('Contestação'), ('Notificação Extrajudicial'), ('Contratos');

-- Table: CaseStatus
-- Lists possible statuses for cases, such as Ativo and Arquivado.
CREATE TABLE IF NOT EXISTS CaseStatus (
    CaseStatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    StatusName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO CaseStatus (StatusName) VALUES
('Ativo'), ('Arquivado');

-- Table: DeadlineType
-- Enumerates the types of deadlines, such as Reunião, Petição Inicial, etc.
CREATE TABLE IF NOT EXISTS DeadlineType (
    DeadlineTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    TypeName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DeadlineType (TypeName) VALUES
('Reunião'), ('Petição Inicial'), ('Notificação Extrajudicial'), ('Contrato'),
('Defesa'), ('Impugnação'), ('Recurso'), ('E-mail'), ('Manifestação'),
('Audiência Conciliação'), ('Audiência de Instrução'), ('Sentença');

-- Table: DeadlineStatus
-- Defines the possible statuses for deadlines, such as Entregue, Pedente, etc.
CREATE TABLE IF NOT EXISTS DeadlineStatus (
    DeadlineStatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    StatusName TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO DeadlineStatus (StatusName) VALUES
('Entregue'), ('Pedente'), ('Trânsito em Julgado'), ('Aguardando');
