/**
 * Enhanced XMRT Ecosystem V2 API Server
 * 
 * This server integrates with the XMRT Integration Core to provide
 * unified API access to all ecosystem components including:
 * - Multi-agent coordination
 * - Data processing and RAG
 * - Security monitoring
 * - Mesh network management
 * - DAO governance
 * 
 * @author Manus AI
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import the Integration Core
const XMRTIntegrationCore = require('../../packages/integration-core');

class EnhancedXMRTServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.integrationCore = new XMRTIntegrationCore();
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security middleware
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        });
        this.app.use('/api/', limiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    /**
     * Setup API routes
     */
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                integrationCore: this.integrationCore.isInitialized
            });
        });

        // System status
        this.app.get('/api/system/status', (req, res) => {
            try {
                const status = this.integrationCore.getSystemStatus();
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Agent coordination routes
        this.app.use('/api/agents', this.createAgentRoutes());

        // Data processing routes
        this.app.use('/api/data', this.createDataRoutes());

        // Security monitoring routes
        this.app.use('/api/security', this.createSecurityRoutes());

        // Mesh network routes
        this.app.use('/api/mesh', this.createMeshRoutes());

        // Governance routes
        this.app.use('/api/governance', this.createGovernanceRoutes());

        // Workflow automation routes
        this.app.use('/api/workflows', this.createWorkflowRoutes());

        // Mining routes
        this.app.use('/api/mining', this.createMiningRoutes());

        // Supabase integration routes
        this.app.use('/api/supabase', this.createSupabaseRoutes());
    }

    /**
     * Create agent coordination routes
     */
    createAgentRoutes() {
        const router = express.Router();

        // Get all agents status
        router.get('/status', async (req, res) => {
            try {
                const agentService = this.integrationCore.services.get('agentFramework');
                if (!agentService) {
                    return res.status(404).json({ error: 'Agent framework not initialized' });
                }

                res.json({
                    framework: agentService.name,
                    status: agentService.status,
                    agents: agentService.agents,
                    capabilities: agentService.capabilities
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Coordinate agent task
        router.post('/coordinate', async (req, res) => {
            try {
                const { task, agents, data } = req.body;
                
                const result = await this.integrationCore.coordinateDataFlow(
                    'api',
                    'agentFramework',
                    { task, agents, data }
                );

                res.json({
                    success: true,
                    coordinationId: `coord_${Date.now()}`,
                    result
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create data processing routes
     */
    createDataRoutes() {
        const router = express.Router();

        // Process data with RAG
        router.post('/process', async (req, res) => {
            try {
                const { data, type, options } = req.body;
                
                const result = await this.integrationCore.coordinateDataFlow(
                    'api',
                    'dataProcessing',
                    { data, type, options }
                );

                res.json({
                    success: true,
                    processedData: result,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Query with RAG
        router.post('/query', async (req, res) => {
            try {
                const { query, context, multimodal } = req.body;
                
                // Simulate RAG query processing
                const result = {
                    query,
                    response: `Processed query: "${query}" with RAG capabilities`,
                    context: context || 'xmrt-ecosystem',
                    multimodal: multimodal || false,
                    sources: ['mining-data', 'governance-docs', 'security-logs'],
                    confidence: 0.95
                };

                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create security monitoring routes
     */
    createSecurityRoutes() {
        const router = express.Router();

        // Get security status
        router.get('/status', async (req, res) => {
            try {
                const securityService = this.integrationCore.services.get('security');
                if (!securityService) {
                    return res.status(404).json({ error: 'Security service not initialized' });
                }

                res.json({
                    service: securityService.name,
                    status: securityService.status,
                    components: securityService.components,
                    monitoring: securityService.monitoring
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Generate zero-knowledge proof
        router.post('/zk-proof', async (req, res) => {
            try {
                const { data, circuit } = req.body;
                
                // Simulate ZK proof generation
                const proof = {
                    proofId: `zk_${Date.now()}`,
                    circuit: circuit || 'default',
                    verified: true,
                    timestamp: new Date().toISOString(),
                    hash: `0x${Math.random().toString(16).substr(2, 64)}`
                };

                res.json({
                    success: true,
                    proof
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create mesh network routes
     */
    createMeshRoutes() {
        const router = express.Router();

        // Get mesh network status
        router.get('/status', async (req, res) => {
            try {
                const meshService = this.integrationCore.services.get('meshNetwork');
                if (!meshService) {
                    return res.status(404).json({ error: 'Mesh network not initialized' });
                }

                res.json({
                    service: meshService.name,
                    status: meshService.status,
                    network: meshService.network,
                    capabilities: meshService.capabilities
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Simulate mesh node discovery
        router.get('/nodes', async (req, res) => {
            try {
                const nodes = [
                    {
                        id: 'node_001',
                        status: 'online',
                        location: { lat: 10.0, lng: -84.0 },
                        signal: 85,
                        mining: true
                    },
                    {
                        id: 'node_002',
                        status: 'online',
                        location: { lat: 10.1, lng: -84.1 },
                        signal: 92,
                        mining: true
                    }
                ];

                res.json({
                    nodes,
                    total: nodes.length,
                    online: nodes.filter(n => n.status === 'online').length
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create governance routes
     */
    createGovernanceRoutes() {
        const router = express.Router();

        // Get governance status
        router.get('/status', async (req, res) => {
            try {
                const govService = this.integrationCore.services.get('governanceUI');
                if (!govService) {
                    return res.status(404).json({ error: 'Governance service not initialized' });
                }

                res.json({
                    service: govService.name,
                    status: govService.status,
                    components: govService.components,
                    capabilities: govService.capabilities
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get proposals
        router.get('/proposals', async (req, res) => {
            try {
                const proposals = [
                    {
                        id: 'prop_001',
                        title: 'Increase Mining Pool Allocation',
                        description: 'Proposal to increase mining pool allocation by 15%',
                        status: 'active',
                        votes: { for: 150, against: 45 },
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 'prop_002',
                        title: 'Implement MESHNET Expansion',
                        description: 'Proposal to expand MESHNET coverage to rural areas',
                        status: 'pending',
                        votes: { for: 0, against: 0 },
                        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ];

                res.json({ proposals });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create workflow automation routes
     */
    createWorkflowRoutes() {
        const router = express.Router();

        // Get workflow status
        router.get('/status', async (req, res) => {
            try {
                const workflowService = this.integrationCore.services.get('workflowAutomation');
                if (!workflowService) {
                    return res.status(404).json({ error: 'Workflow service not initialized' });
                }

                res.json({
                    service: workflowService.name,
                    status: workflowService.status,
                    workflows: workflowService.workflows,
                    capabilities: workflowService.capabilities
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create mining routes
     */
    createMiningRoutes() {
        const router = express.Router();

        // Get mining statistics
        router.get('/stats', async (req, res) => {
            try {
                const stats = {
                    totalMiners: 1247,
                    activeMiners: 892,
                    hashRate: '2.5 MH/s',
                    blocksFound: 156,
                    earnings: {
                        total: '45.67 XMR',
                        daily: '0.23 XMR',
                        weekly: '1.61 XMR'
                    },
                    network: {
                        difficulty: 350000000000,
                        blockHeight: 2987654,
                        lastBlock: new Date(Date.now() - 2 * 60 * 1000).toISOString()
                    }
                };

                res.json(stats);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Create Supabase integration routes
     */
    createSupabaseRoutes() {
        const router = express.Router();

        // Database health check
        router.get('/health', async (req, res) => {
            try {
                const supabaseService = this.integrationCore.services.get('supabase');
                if (!supabaseService) {
                    return res.status(404).json({ error: 'Supabase service not initialized' });
                }

                res.json({
                    service: supabaseService.name,
                    status: supabaseService.status,
                    endpoints: supabaseService.endpoints,
                    capabilities: supabaseService.capabilities
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint not found',
                path: req.originalUrl,
                method: req.method
            });
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            console.error('Server error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        });
    }

    /**
     * Start the server
     */
    async start() {
        try {
            // Initialize the integration core
            await this.integrationCore.initialize();

            // Start the Express server
            this.server = this.app.listen(this.port, () => {
                console.log(`🚀 Enhanced XMRT API Server running on port ${this.port}`);
                console.log(`📊 Health check: http://localhost:${this.port}/health`);
                console.log(`🔧 System status: http://localhost:${this.port}/api/system/status`);
            });

            // Graceful shutdown handling
            process.on('SIGTERM', () => this.shutdown());
            process.on('SIGINT', () => this.shutdown());

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }

    /**
     * Shutdown the server gracefully
     */
    async shutdown() {
        console.log('🛑 Shutting down Enhanced XMRT API Server...');

        if (this.server) {
            this.server.close(() => {
                console.log('📴 HTTP server closed');
            });
        }

        await this.integrationCore.shutdown();
        process.exit(0);
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new EnhancedXMRTServer();
    server.start();
}

module.exports = EnhancedXMRTServer;
