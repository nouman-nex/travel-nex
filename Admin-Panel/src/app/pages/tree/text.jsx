import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
} from "react-flow-renderer";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { MEDIA_BASE_URL, postRequest } from "../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

// Cache for memoization
const treeDataCache = new Map();

// Random color generator
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Custom empty node component
const EmptyNode = ({ data }) => {
  return (
    <div
      style={{
        borderTop: `4px solid #ddd`,
        padding: "12px",
        borderRadius: "8px",
        background: "#f9f9f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        width: "160px",
        minHeight: "70px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed #ccc",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          color: "#999",
          fontSize: "12px",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Empty Slot
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom node component with tooltip
const CustomNode = ({ data, onSelectNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (data.isEmpty) {
    return <EmptyNode data={data} />;
  }

  const truncate = (str, maxLength) => {
    return str && str.length > maxLength
      ? str.slice(0, maxLength) + "..."
      : str || "";
  };

  return (
    <div
      onClick={() => onSelectNode && onSelectNode(data.id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        borderTop: `4px solid ${data.borderColor}`,
        padding: "12px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: "160px",
        minHeight: "70px",
        cursor: onSelectNode ? "pointer" : "default",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          height={32}
          width={32}
          style={{ borderRadius: "50%", flexShrink: 0 }}
          src={data.profilePhoto}
          alt="Profile"
          onError={(e) => {
            e.target.src =
              "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png";
          }}
        />
        <div style={{ marginLeft: "12px", overflow: "hidden" }}>
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>
            {truncate(data.fullName, 12)}
          </div>
          <div style={{ fontSize: "11px", color: "#666" }}>
            {truncate(data.email, 12)}
          </div>
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
            minWidth: "240px",
            maxWidth: "330px",
            lineHeight: "1.4",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{ fontWeight: "bold", marginBottom: "8px", color: "#fff" }}
          >
            User Details
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>Username:</strong> {data.username || "N/A"}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>Email:</strong> {data.email || "N/A"}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>Rank:</strong> {data.rank || "No rank"}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>Sponsored By:</strong> {data.directReferralName || "N/A"}
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ marginBottom: "6px" }}>
              <strong>Total Left Points:</strong> {data.totalLeftPoints || 0}
            </div>

            <div style={{ marginBottom: "6px" }}>
              <strong>Total Right Points:</strong> {data.totalRightPoints || 0}
            </div>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: data.greenIdStatus ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {data.greenIdStatus ? "Green ID" : "Red ID"}
            </span>
          </div>

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

// Create proper binary tree structure with empty nodes
const createBinaryTree = (node, maxDepth = 3, currentDepth = 0) => {
  if (!node || currentDepth >= maxDepth) return null;

  const binaryNode = {
    ...node,
    left: null,
    right: null,
  };

  if (node.children && node.children.length > 0) {
    // Left child (first child)
    if (node.children[0]) {
      binaryNode.left = createBinaryTree(
        node.children[0],
        maxDepth,
        currentDepth + 1
      );
    }

    // Right child (second child)
    if (node.children[1]) {
      binaryNode.right = createBinaryTree(
        node.children[1],
        maxDepth,
        currentDepth + 1
      );
    }
  }

  // If we have a left child but no right child, add empty node
  if (binaryNode.left && !binaryNode.right && currentDepth < maxDepth - 1) {
    binaryNode.right = {
      id: `empty_${node.id}_right_${currentDepth}`,
      isEmpty: true,
      left: null,
      right: null,
    };
  }

  // If we have a right child but no left child, add empty node
  if (binaryNode.right && !binaryNode.left && currentDepth < maxDepth - 1) {
    binaryNode.left = {
      id: `empty_${node.id}_left_${currentDepth}`,
      isEmpty: true,
      left: null,
      right: null,
    };
  }

  return binaryNode;
};

// Process binary tree data for ReactFlow
// Process binary tree data for ReactFlow
const processBinaryTreeData = (tree, x = 0, y = 0, parentId = null) => {
  const nodes = [];
  const edges = []; // --- Change these values for more or less spacing ---

  const HORIZONTAL_SPACING = 300; // Increased from 200
  const VERTICAL_SPACING = 200; // Increased from 150
  // ---------------------------------------------------
  const traverse = (node, x, y, parentId, level = 0) => {
    if (!node) return;

    const nodeId = node.id.toString();
    const borderColor = node.isEmpty ? "#ddd" : getRandomColor();

    nodes.push({
      id: nodeId,
      position: { x, y },
      type: node.isEmpty ? "emptyNode" : "customNode",
      data: {
        ...node,
        borderColor,
      },
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
        style: {
          stroke: node.isEmpty ? "#ccc" : "#666",
          strokeWidth: node.isEmpty ? 1 : 2,
          strokeDasharray: node.isEmpty ? "5,5" : "none",
        },
      });
    }

    const childY = y + VERTICAL_SPACING;
    const spacing = Math.max(HORIZONTAL_SPACING * Math.pow(0.7, level), 120); // Left child

    if (node.left) {
      traverse(node.left, x - spacing, childY, nodeId, level + 1);
    } // Right child

    if (node.right) {
      traverse(node.right, x + spacing, childY, nodeId, level + 1);
    }
  };

  traverse(tree, x, y, parentId);
  return { nodes, edges };
};

// Recursive helper to find subtree by ID
const findSubtree = (tree, targetId) => {
  if (!tree) return null;
  if (tree.id.toString() === targetId.toString()) return tree;

  const leftResult = findSubtree(tree.left, targetId);
  if (leftResult) return leftResult;

  const rightResult = findSubtree(tree.right, targetId);
  if (rightResult) return rightResult;

  return null;
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

// Depth Control Component
const DepthControls = ({ depth, onDepthChange, isLoading }) => {
  const handleDecrease = () => {
    if (depth > 1) {
      onDepthChange(depth - 1);
    }
  };

  const handleIncrease = () => {
    if (depth < 10) {
      onDepthChange(depth + 1);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "8px 12px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={handleDecrease}
        disabled={depth <= 1 || isLoading}
        sx={{
          padding: "4px",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        sx={{
          minWidth: "60px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        Level {depth}
      </Typography>

      <IconButton
        size="small"
        onClick={handleIncrease}
        disabled={depth >= 10 || isLoading}
        sx={{
          padding: "4px",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

// Background Loading Spinner
const BackgroundLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        padding: "12px 20px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={20} />
      <Typography variant="body2" sx={{ fontSize: "14px", color: "#666" }}>
        Loading new data...
      </Typography>
    </Box>
  );
};

// Flow component with custom controls
const Flow = ({
  nodes,
  edges,
  onNodeClick,
  onRefresh,
  isLoading,
  depth,
  onDepthChange,
  isBackgroundLoading,
}) => {
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.2,
        });
      }, 150);
    }
  }, [reactFlowInstance, nodes]);

  if (isLoading) {
    return (
      <div
        className="loading"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: "16px",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ fontSize: "16px", color: "#666" }}>
          Loading tree data (Level {depth})...
        </Typography>
      </div>
    );
  }

  return (
    <>
      <DepthControls
        depth={depth}
        onDepthChange={onDepthChange}
        isLoading={isBackgroundLoading}
      />
      <BackgroundLoader isVisible={isBackgroundLoading} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          customNode: (props) => (
            <CustomNode {...props} onSelectNode={onNodeClick} />
          ),
          emptyNode: (props) => <EmptyNode {...props} />,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background variant="dots" gap={20} size={1} color="#f0f0f0" />
        <CustomControls onRefresh={onRefresh} />
      </ReactFlow>
    </>
  );
};

// Main Tree component
const BinaryTree = () => {
  const [fullTree, setFullTree] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [error, setError] = useState(null);
  const [depth, setDepth] = useState(3);
  const { User } = useAuth();

  // Generate cache key
  const getCacheKey = (userId, depth) => `tree_${userId}_${depth}`;

  // Memoized cached data
  const cachedData = useMemo(() => {
    if (!User?._id) return null;
    const cacheKey = getCacheKey(User._id, depth);
    return treeDataCache.get(cacheKey) || null;
  }, [User?._id, depth]);

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
      totalLeftPoints: node.totalLeftPoints,
      greenIdStatus: node.greenIdStatus,
      totalRightPoints: node.totalRightPoints,
      directReferralName: node.directReferralName,
      isKycVerified: node.isKycVerified,
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

  // Fetch referral tree data
  const fetchReferralTreeData = useCallback(
    (showBackgroundLoader = false) => {
      const cacheKey = getCacheKey(User?._id, depth);

      if (showBackgroundLoader) {
        setIsBackgroundLoading(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      postRequest(
        "/getbinaryTree",
        { userId: User?._id, depth: depth },
        (response) => {
          console.log("Binary response", response);
          if (response.data.success && response.data.tree) {
            const normalized = normalizeTree(response.data.tree);

            // Create proper binary tree structure
            const binaryTree = createBinaryTree(normalized, depth);
            setFullTree(binaryTree);

            // Cache the data
            treeDataCache.set(cacheKey, {
              tree: binaryTree,
              timestamp: Date.now(),
            });

            // Process binary tree with improved positioning
            const { nodes, edges } = processBinaryTreeData(binaryTree);
            setNodes(nodes);
            setEdges(edges);
          } else {
            setError("Failed to load referral tree data");
          }

          if (showBackgroundLoader) {
            setIsBackgroundLoading(false);
          } else {
            setIsLoading(false);
          }
        },
        (error) => {
          setError("An error occurred while fetching the referral tree");
          if (showBackgroundLoader) {
            setIsBackgroundLoading(false);
          } else {
            setIsLoading(false);
          }
        }
      );
    },
    [User, depth]
  );

  // Load cached data immediately, then fetch fresh data
  useEffect(() => {
    if (!User?._id) return;

    // Load cached data first (if available)
    if (cachedData && cachedData.tree) {
      setFullTree(cachedData.tree);
      const { nodes, edges } = processBinaryTreeData(cachedData.tree);
      setNodes(nodes);
      setEdges(edges);
      setIsLoading(false);

      // Check if cache is older than 30 seconds
      const isStale = Date.now() - cachedData.timestamp > 30000;
      if (isStale) {
        // Fetch fresh data in background
        fetchReferralTreeData(true);
      }
    } else {
      // No cache, fetch data normally
      fetchReferralTreeData(false);
    }
  }, [User?._id, depth, cachedData, fetchReferralTreeData]);

  const handleNodeClick = (nodeId) => {
    if (!fullTree || nodeId.includes("empty_")) return;

    const subtree = findSubtree(fullTree, nodeId);
    if (subtree) {
      const binarySubtree = createBinaryTree(subtree, depth - 1);
      const { nodes, edges } = processBinaryTreeData(binarySubtree);
      setNodes(nodes);
      setEdges(edges);
    }
  };

  const handleRefresh = () => {
    // Clear cache for this specific key
    const cacheKey = getCacheKey(User?._id, depth);
    treeDataCache.delete(cacheKey);
    fetchReferralTreeData(false);
  };

  const handleDepthChange = (newDepth) => {
    if (newDepth >= 1 && newDepth <= 10) {
      setDepth(newDepth);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        position: "relative",
        backgroundColor: "#fafafa",
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
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          {error}
          <Button
            onClick={handleRefresh}
            variant="contained"
            size="small"
            style={{ marginLeft: "10px" }}
          >
            Retry
          </Button>
        </div>
      )}

      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          depth={depth}
          onDepthChange={handleDepthChange}
          isBackgroundLoading={isBackgroundLoading}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default BinaryTree;
