import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function ApprovalNodeForm() {
  const { getSelectedNode, updateNode, deleteNode } = useWorkflowStore();
  const selected = getSelectedNode();
  const isApprovalNode = selected?.type === 'approval';
  const label = isApprovalNode ? selected.data.label : 'Approval';
  const description = isApprovalNode ? selected.data.description ?? '' : '';

  return (
    <NodeFormPanel
      title="Approval node"
      subtitle="Configure approval gate details"
      hasSelection={Boolean(isApprovalNode)}
      onSubmit={() => selected && isApprovalNode && updateNode(selected.id, { label, description: description || undefined })}
      onReset={() => selected && isApprovalNode && updateNode(selected.id, { label: 'Approval', description: undefined })}
      onDelete={() => selected && isApprovalNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={(value) => selected && isApprovalNode && updateNode(selected.id, { ...selected.data, label: value })}
      />
      <ControlledField
        label="Description"
        value={description}
        onChange={(value) => selected && isApprovalNode && updateNode(selected.id, { ...selected.data, description: value })}
        placeholder="Optional"
      />
    </NodeFormPanel>
  );
}
