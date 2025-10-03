// MongoDB initialization script for XMRT Ecosystem V2

db = db.getSiblingDB('xmrt_ecosystem');

// Create collections
db.createCollection('users');
db.createCollection('mining_stats');
db.createCollection('dao_proposals');
db.createCollection('mesh_nodes');
db.createCollection('agent_logs');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.mining_stats.createIndex({ timestamp: 1 });
db.dao_proposals.createIndex({ status: 1 });
db.mesh_nodes.createIndex({ nodeId: 1 }, { unique: true });
db.agent_logs.createIndex({ timestamp: 1 });

// Insert sample data
db.mining_stats.insertOne({
  totalMiners: 1247,
  activeMiners: 892,
  hashRate: '2.4 MH/s',
  timestamp: new Date()
});

db.dao_proposals.insertMany([
  {
    id: 'prop-001',
    title: 'Increase Mining Pool Diversity',
    description: 'Proposal to add support for 5 additional mining pools',
    status: 'active',
    votes: { for: 1247, against: 89 },
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  },
  {
    id: 'prop-002',
    title: 'MESHNET Expansion Initiative',
    description: 'Fund development of offline mining capabilities',
    status: 'pending',
    votes: { for: 892, against: 156 },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }
]);

print('XMRT Ecosystem V2 database initialized successfully');
