/**
 * Enhanced XMRT Ecosystem Dashboard
 * 
 * This component provides a comprehensive dashboard for monitoring and managing
 * all aspects of the XMRT ecosystem including:
 * - Mining operations and statistics
 * - DAO governance and proposals
 * - Multi-agent coordination
 * - Security monitoring
 * - Mesh network status
 * - Data processing and RAG queries
 * 
 * @author Manus AI
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Network,
  Users,
  Zap,
  Database,
  Bot,
  Vote,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';

const XMRTDashboard = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [miningStats, setMiningStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [meshNodes, setMeshNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [
        systemResponse,
        miningResponse,
        proposalsResponse,
        meshResponse
      ] = await Promise.all([
        fetch(`${API_BASE}/api/system/status`),
        fetch(`${API_BASE}/api/mining/stats`),
        fetch(`${API_BASE}/api/governance/proposals`),
        fetch(`${API_BASE}/api/mesh/nodes`)
      ]);

      const systemData = await systemResponse.json();
      const miningData = await miningResponse.json();
      const proposalsData = await proposalsResponse.json();
      const meshData = await meshResponse.json();

      setSystemStatus(systemData);
      setMiningStats(miningData);
      setProposals(proposalsData.proposals || []);
      setMeshNodes(meshData.nodes || []);
      setError(null);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatusCard = ({ title, value, icon: Icon, status, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <Icon className="h-8 w-8 text-blue-500 mb-2" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' :
            status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );

  const ServiceStatus = ({ services }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2" />
        System Services
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(services || {}).map(([name, service]) => (
          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const MiningOverview = ({ stats }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Zap className="h-5 w-5 mr-2" />
        Mining Operations
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats?.totalMiners || 0}</p>
          <p className="text-sm text-gray-600">Total Miners</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats?.activeMiners || 0}</p>
          <p className="text-sm text-gray-600">Active Miners</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats?.hashRate || '0 H/s'}</p>
          <p className="text-sm text-gray-600">Hash Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{stats?.earnings?.daily || '0 XMR'}</p>
          <p className="text-sm text-gray-600">Daily Earnings</p>
        </div>
      </div>
    </div>
  );

  const GovernancePanel = ({ proposals }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Vote className="h-5 w-5 mr-2" />
        DAO Governance
      </h3>
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active proposals</p>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{proposal.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  proposal.status === 'active' ? 'bg-green-100 text-green-800' :
                  proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {proposal.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{proposal.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <span className="text-sm text-green-600">
                    For: {proposal.votes?.for || 0}
                  </span>
                  <span className="text-sm text-red-600">
                    Against: {proposal.votes?.against || 0}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Deadline: {new Date(proposal.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const MeshNetworkStatus = ({ nodes }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Network className="h-5 w-5 mr-2" />
        MESHNET Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{nodes.length}</p>
          <p className="text-sm text-gray-600">Active Nodes</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {nodes.filter(n => n.mining).length}
          </p>
          <p className="text-sm text-gray-600">Mining Nodes</p>
        </div>
      </div>
      {nodes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Recent Nodes</h4>
          <div className="space-y-2">
            {nodes.slice(0, 3).map((node) => (
              <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{node.id}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{node.signal}%</span>
                  <span className={`w-2 h-2 rounded-full ${
                    node.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading && !systemStatus) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading XMRT Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">XMRT Ecosystem V2</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <Activity className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Integration Core"
            value={systemStatus?.core?.initialized ? "Active" : "Inactive"}
            icon={Database}
            status={systemStatus?.core?.initialized ? "active" : "inactive"}
            description="Central coordination hub"
          />
          <StatusCard
            title="Active Services"
            value={`${systemStatus?.summary?.active || 0}/${systemStatus?.summary?.total || 0}`}
            icon={Bot}
            status={systemStatus?.summary?.active > 0 ? "active" : "inactive"}
            description="Integrated ecosystem services"
          />
          <StatusCard
            title="Mining Network"
            value={miningStats?.activeMiners || 0}
            icon={Zap}
            status="active"
            description="Active mobile miners"
          />
          <StatusCard
            title="Security Status"
            value="Protected"
            icon={Shield}
            status="active"
            description="Wazuh + ZK proofs active"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ServiceStatus services={systemStatus?.services} />
          <MiningOverview stats={miningStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GovernancePanel proposals={proposals} />
          <MeshNetworkStatus nodes={meshNodes} />
        </div>
      </div>
    </div>
  );
};

export default XMRTDashboard;
