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
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { MEDIA_BASE_URL, postRequest } from "../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";

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
const EmptyNode = ({ d }) => {
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
        EMPTY NODE
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom node component with tooltip
const CustomNode = ({ data, onSelectNode, t }) => {
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
            {t("tree.userDetails")}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("Username")}:</strong> {data.username || "N/A"}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("Email")}:</strong> {data.email || "N/A"}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.Rank")}:</strong> {data.rank || t("No rank")}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.SponsoredBy")}:</strong> {data.directReferralName || "N/A"}
          </div>


          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.TotalLeftBusiness")}:</strong> {data.totalLeftPoints || 0}
          </div>

          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.TotalRightBusiness")}:</strong> {data.totalRightPoints || 0}
          </div>


          <div style={{ marginBottom: "6px" }}>
            <strong>{t("tree.Status")}:</strong>{" "}
            <span
              style={{
                color: data.greenIdStatus ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {data.greenIdStatus ? t("Green ID") : t("Red ID")}
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

// Check if a node is a leaf (has no real children )
const isLeafNode = (node) => {
  if (!node || !node.children) return true;
  return (
    node.children.length === 0 ||
    node.children.every((child) => child && child.isEmpty)
  );
};

// Create proper binary tree structure with empty nodes
const createBinaryTree = (node, maxDepth = 5, currentDepth = 0) => {
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
// Process binary tree data for ReactFlow - COMPLETELY FIXED VERSION
const processBinaryTreeData = (tree, x = 0, y = 0, parentId = null) => {
  const nodes = [];
  const edges = [];

  const VERTICAL_SPACING = 200;

  // Pre-calculate tree width at each level to determine proper spacing
  const getTreeWidth = (node, level = 0) => {
    if (!node) return 0;
    if (level === 0) return 1;

    const leftWidth = getTreeWidth(node.left, level + 1);
    const rightWidth = getTreeWidth(node.right, level + 1);
    return leftWidth + rightWidth;
  };

  // Calculate maximum width needed
  const maxWidth = getTreeWidth(tree);
  const baseSpacing = Math.max(200, maxWidth * 80); // Dynamic base spacing

  const traverse = (
    node,
    x,
    y,
    parentId,
    level = 0,
    siblingIndex = 0,
    totalSiblingsAtLevel = 1
  ) => {
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

    // COMPLETELY NEW SPACING CALCULATION
    const spacingArray = [450, 230, 120, 80, 80, 60];

    // Fixed spacing for each level
    const currentSpacing = spacingArray[level] || 60;

    // Left child
    if (node.left) {
      traverse(node.left, x - currentSpacing, childY, nodeId, level + 1, 0, 2);
    }

    // Right child
    if (node.right) {
      traverse(node.right, x + currentSpacing, childY, nodeId, level + 1, 1, 2);
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
        Loading tree data...
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
  isBackgroundLoading,
}) => {
  const reactFlowInstance = useReactFlow();

  const { t } = useTranslation()

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
          Loading tree data...
        </Typography>
      </div>
    );
  }

  return (
    <>
      <BackgroundLoader isVisible={isBackgroundLoading} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          customNode: (props) => (
            <CustomNode {...props} onSelectNode={onNodeClick} t={t} />
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
  const { User } = useAuth();

  // Generate cache key
  const getCacheKey = (userId) => `tree_${userId}`;

  // Memoized cached data
  const cachedData = useMemo(() => {
    if (!User?._id) return null;
    const cacheKey = getCacheKey(User._id);
    return treeDataCache.get(cacheKey) || null;
  }, [User?._id]);

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
    (userId = null, showBackgroundLoader = false) => {
      const targetUserId = userId || User?._id;
      const cacheKey = getCacheKey(targetUserId);

      if (showBackgroundLoader) {
        setIsBackgroundLoading(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      postRequest(
        "/getbinaryTree",
        { userId: targetUserId },
        (response) => {
          console.log("Binary response", response);
          if (response.data.success && response.data.tree) {
            const normalized = normalizeTree(response.data.tree);

            // Create proper binary tree structure
            const binaryTree = createBinaryTree(normalized, 5);
            setFullTree(binaryTree);

            // Cache the data only for main user
            if (!userId || userId === User?._id) {
              treeDataCache.set(cacheKey, {
                tree: binaryTree,
                timestamp: Date.now(),
              });
            }

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
    [User]
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
        fetchReferralTreeData(null, true);
      }
    } else {
      // No cache, fetch data normally
      fetchReferralTreeData(null, false);
    }
  }, [User?._id, cachedData, fetchReferralTreeData]);

  const handleNodeClick = (nodeId) => {
    if (!fullTree || nodeId.includes("empty_")) return;

    const clickedNode = findSubtree(fullTree, nodeId);

    if (!clickedNode) return;

    // Check if it's a leaf node (has no real children)
    if (isLeafNode(clickedNode)) {
      // Fetch new tree data for this leaf node
      console.log("Fetching data for leaf node:", nodeId);
      fetchReferralTreeData(nodeId, true);
    } else {
      // Normal subtree navigation for non-leaf nodes
      const binarySubtree = createBinaryTree(clickedNode, 5);
      const { nodes, edges } = processBinaryTreeData(binarySubtree);
      setNodes(nodes);
      setEdges(edges);
    }
  };

  const handleRefresh = () => {
    // Clear cache for main user
    const cacheKey = getCacheKey(User?._id);
    treeDataCache.delete(cacheKey);
    fetchReferralTreeData(null, false);
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
          isBackgroundLoading={isBackgroundLoading}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default BinaryTree;
