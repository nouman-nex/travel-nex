import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
} from "react-flow-renderer";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, CircularProgress } from "@mui/material";
import { MEDIA_BASE_URL, postRequest } from "../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";

// Cache management
let globalTreeCache = new Map();

// Random color generator
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to check if a node is a leaf node
const isLeafNode = (node) => {
  return !node.children || node.children.length === 0;
};

// Custom node component with leaf node detection
const CustomNode = ({ data, onSelectNode, t }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const handleNodeClick = () => {
    onSelectNode(data.id, data.isLeaf);
  };

  return (
    <div
      onClick={handleNodeClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        borderTop: `4px solid ${data.borderColor}`,
        padding: "10px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "auto",
        cursor: "pointer",
        position: "relative",
        border: data.isLeaf ? "2px dashed #9A8A5F" : "none",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          height={30}
          width={30}
          style={{ borderRadius: "50%" }}
          src={data.profilePhoto}
          alt="Profile"
        />
        <div style={{ marginLeft: "15px" }}>
          <div style={{ fontWeight: "bold" }}>
            {truncate(data.fullName, 12)}
          </div>
          <div>{truncate(data.email, 12)}</div>
          {data.isLeaf && (
            <div style={{ fontSize: "10px", color: "#9A8A5F", fontStyle: "italic" }}>
              ↓
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />

      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "10px",
            backgroundColor: "#333",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 999999999,
            fontSize: "14px",
            minWidth: "220px",
            maxWidth: "300px",
            lineHeight: "1.4",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{ fontWeight: "bold", marginBottom: "8px", color: "#fff" }}
          >
            {t("tree.userDetails")}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.username")}:</strong> {data.username || t("tree.notAvailable")}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.email")}:</strong> {data.email || t("tree.notAvailable")}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.rank")}:</strong> {data.rank || t("tree.noRank")}
          </div>

          {data.isLeaf && (
            <div style={{ marginBottom: "6px", color: "#9A8A5F" }}>
              <strong>{t("tree.leafNode")}:</strong> {t("tree.clickToFetchSubtree")}
            </div>
          )}

          {/* Tooltip arrow */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #333",
            }}
          />
        </div>
      )}
    </div>
  );
};

// Improved process tree function with better spacing calculation
const processTreeData = (tree, x = 0, y = 0, parentId = null) => {
  const nodes = [];
  const edges = [];

  const calculateTreeWidth = (node, level = 0) => {
    if (!node || !node.children || node.children.length === 0) {
      return 1;
    }
    return node.children.reduce(
      (sum, child) => sum + calculateTreeWidth(child, level + 1),
      0
    );
  };

  const traverse = (node, x, y, parentId, level = 0) => {
    if (!node) return;

    const nodeId = node.id.toString();
    const borderColor = getRandomColor();
    const isLeaf = isLeafNode(node);

    // Dynamic spacing based on level - better horizontal spacing for deeper levels
    const baseSpacing = 180;
    const levelMultiplier = 1 + (level * 0.15);
    const nodeSpacing = baseSpacing * levelMultiplier;

    nodes.push({
      id: nodeId,
      position: { x, y },
      type: "customNode",
      data: {
        fullName: node.fullName,
        profilePhoto: node.profilePhoto,
        email: node.email,
        id: node.id,
        borderColor,
        username: node.username,
        rank: node.rank,
        isKycVerified: node.isKycVerified,
        isLeaf: isLeaf,
      },
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
      });
    }

    if (node.children && node.children.length > 0) {
      const totalChildWidth = node.children.reduce(
        (sum, child) => sum + calculateTreeWidth(child, level + 1),
        0
      );

      // Better spacing calculation for horizontal distribution
      let childX = x - (totalChildWidth * nodeSpacing) / 2;

      node.children.forEach((child) => {
        const childWidth = calculateTreeWidth(child, level + 1);
        const childCenterOffset = (childWidth * nodeSpacing) / 2;

        traverse(
          child,
          childX + childCenterOffset,
          y + 120,
          nodeId,
          level + 1
        );
        childX += childWidth * nodeSpacing;
      });
    }
  };

  traverse(tree, x, y, parentId);
  return { nodes, edges };
};

// Recursive helper to find subtree by ID
const findSubtree = (tree, targetId) => {
  if (!tree) return null;
  if (tree.id.toString() === targetId.toString()) return tree;

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const result = findSubtree(child, targetId);
      if (result) return result;
    }
  }

  return null;
};

// Helper to update tree with new data
const updateTreeWithNewData = (originalTree, nodeId, newSubtree) => {
  if (!originalTree) return originalTree;

  if (originalTree.id.toString() === nodeId.toString()) {
    return { ...originalTree, children: newSubtree.children };
  }

  if (originalTree.children && originalTree.children.length > 0) {
    return {
      ...originalTree,
      children: originalTree.children.map(child =>
        updateTreeWithNewData(child, nodeId, newSubtree)
      )
    };
  }

  return originalTree;
};

// Custom Controls component with refresh button
const CustomControls = ({ onRefresh }) => {
  return (
    <Controls showInteractive={false} position="bottom-left">
      <div
        className="react-flow__controls-button react-flow__controls-refreshbutton"
        onClick={onRefresh}
        title="Reset View"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RefreshIcon style={{ width: "15px", height: "15px" }} />
      </div>
    </Controls>
  );
};

// Loading indicator component
const LoadingIndicator = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px 15px",
        borderRadius: "25px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 1000,
        fontSize: "12px",
      }}
    >
      <CircularProgress size={16} style={{ color: "white" }} />
      Loading new nodes...
    </div>
  );
};

// Flow component with custom controls
const Flow = ({ nodes, edges, onNodeClick, onRefresh, isLoading, isBackgroundLoading }) => {
  const reactFlowInstance = useReactFlow();
  const { t } = useTranslation()
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [reactFlowInstance, nodes]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <CircularProgress />
        <div>Loading tree data...</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          customNode: (props) => (
            <CustomNode {...props} onSelectNode={onNodeClick} t={t} />
          ),
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <CustomControls onRefresh={onRefresh} />
      </ReactFlow>
      <LoadingIndicator isVisible={isBackgroundLoading} />
    </div>
  );
};

// Main Tree component with improved caching and click handling
const Tree = () => {
  const [fullTree, setFullTree] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentViewNodeId, setCurrentViewNodeId] = useState(null);
  const { User } = useAuth();
  const loadingQueue = useRef(new Set()); // Track nodes being loaded
  const lastClickTime = useRef(new Map()); // Track click times to prevent double clicks

  // Normalize tree data from API response
  const normalizeTree = (node) => {
    if (!node) return null;

    const newNode = {
      id: node.id.toString(),
      fullName: node.username,
      email: node.email,
      profilePhoto: node.profileImage
        ? `${MEDIA_BASE_URL}/${node.profileImage}`
        : "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
      username: node.username,
      rank: node.rank,
      children: [],
    };

    if (
      node.children &&
      Array.isArray(node.children) &&
      node.children.length > 0
    ) {
      newNode.children = node.children.map((child) => normalizeTree(child));
    }

    return newNode;
  };

  // Fetch referral tree data with improved caching - remove dependencies causing re-renders
  const fetchReferralTreeData = useCallback((userId = null, isLeafExpansion = false) => {
    const targetUserId = userId || User?._id;
    const cacheKey = `tree_${targetUserId}`;

    // Check cache first
    if (!isLeafExpansion && globalTreeCache.has(cacheKey)) {
      const cachedData = globalTreeCache.get(cacheKey);
      setFullTree(cachedData);
      setCurrentViewNodeId(targetUserId);
      const { nodes, edges } = processTreeData(cachedData);
      setNodes(nodes);
      setEdges(edges);
      return;
    }

    if (!isLeafExpansion) {
      setIsLoading(true);
    } else {
      setIsBackgroundLoading(true);
      loadingQueue.current.add(targetUserId);
    }

    setError(null);

    postRequest(
      "/getUnilevelTree",
      { userId: targetUserId },
      (response) => {
        console.log(response)
        if (response.data.success && response.data.tree) {
          const normalized = normalizeTree(response.data.tree);

          if (!isLeafExpansion) {
            // Cache the full tree data
            globalTreeCache.set(cacheKey, normalized);
            setFullTree(normalized);
            setCurrentViewNodeId(targetUserId);

            const { nodes, edges } = processTreeData(normalized);
            setNodes(nodes);
            setEdges(edges);
          } else {
            // Update cached tree and current view for leaf expansion
            const rootCacheKey = `tree_${User?._id}`;
            if (globalTreeCache.has(rootCacheKey)) {
              const updatedTree = updateTreeWithNewData(
                globalTreeCache.get(rootCacheKey),
                targetUserId,
                normalized
              );
              globalTreeCache.set(rootCacheKey, updatedTree);
            }

            // Cache this subtree as well
            globalTreeCache.set(cacheKey, normalized);

            // Update current view if we're viewing this node
            setFullTree(normalized);
            const { nodes, edges } = processTreeData(normalized);
            setNodes(nodes);
            setEdges(edges);
            setCurrentViewNodeId(targetUserId);
          }
        } else {
          setError("Failed to load referral tree data");
        }

        if (!isLeafExpansion) {
          setIsLoading(false);
        } else {
          setIsBackgroundLoading(false);
          loadingQueue.current.delete(targetUserId);
        }
      },
      (error) => {
        setError("An error occurred while fetching the referral tree");

        if (!isLeafExpansion) {
          setIsLoading(false);
        } else {
          setIsBackgroundLoading(false);
          loadingQueue.current.delete(targetUserId);
        }
      }
    );
  }, [User?._id]); // Only depend on User ID

  // Initial load with cache check - remove fetchReferralTreeData from dependencies
  useEffect(() => {
    if (User?._id && !fullTree) { // Only load if no tree exists
      const cacheKey = `tree_${User._id}`;
      if (globalTreeCache.has(cacheKey)) {
        // Load from cache immediately
        const cachedData = globalTreeCache.get(cacheKey);
        setFullTree(cachedData);
        setCurrentViewNodeId(User._id);
        const { nodes, edges } = processTreeData(cachedData);
        setNodes(nodes);
        setEdges(edges);
      } else {
        // Fetch from API if not in cache
        fetchReferralTreeData();
      }
    }
  }, [User?._id]); // Only depend on User ID

  const handleNodeClick = (nodeId, isLeaf) => {
    const now = Date.now();
    const lastClick = lastClickTime.current.get(nodeId) || 0;

    // Prevent double clicks within 1 second
    if (now - lastClick < 1000) {
      return;
    }

    lastClickTime.current.set(nodeId, now);

    if (isLeaf) {
      // For leaf nodes, fetch new tree data from the API
      if (!loadingQueue.current.has(nodeId)) {
        fetchReferralTreeData(nodeId, true);
      }
    } else {
      // For normal nodes, check cache first, then show subtree
      const cacheKey = `tree_${nodeId}`;
      let subtree = null;

      if (globalTreeCache.has(cacheKey)) {
        subtree = globalTreeCache.get(cacheKey);
      } else {
        // Try to find in current tree or root tree
        const rootCacheKey = `tree_${User?._id}`;
        const rootTree = globalTreeCache.get(rootCacheKey);
        subtree = findSubtree(rootTree || fullTree, nodeId);
      }

      if (subtree) {
        // Update state without causing re-render loops
        setCurrentViewNodeId(nodeId);
        setFullTree(subtree);
        const { nodes, edges } = processTreeData(subtree);
        setNodes(nodes);
        setEdges(edges);
      }
    }
  };

  const handleRefresh = () => {
    // Clear cache and reload from root
    globalTreeCache.clear();
    setCurrentViewNodeId(null);
    fetchReferralTreeData();
  };

  const handleResetView = () => {
    // Reset to cached root tree view
    const rootCacheKey = `tree_${User?._id}`;
    if (globalTreeCache.has(rootCacheKey)) {
      const rootTree = globalTreeCache.get(rootCacheKey);
      setFullTree(rootTree);
      setCurrentViewNodeId(User._id);
      const { nodes, edges } = processTreeData(rootTree);
      setNodes(nodes);
      setEdges(edges);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "20px",
            position: "absolute",
            width: "100%",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {error}
          <div style={{ marginTop: "10px" }}>
            <Button
              onClick={handleRefresh}
              variant="contained"
              size="small"
              style={{ marginRight: "10px" }}
            >
              Retry
            </Button>
            {globalTreeCache.has(`tree_${User?._id}`) && (
              <Button
                onClick={handleResetView}
                variant="outlined"
                size="small"
              >
                Show Full Tree
              </Button>
            )}
          </div>
        </div>
      )}

      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isBackgroundLoading={isBackgroundLoading}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default Tree;