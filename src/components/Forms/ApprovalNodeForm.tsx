import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function ApprovalNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isApprovalNode = selected?.type === 'approval';
  const [label, setLabel] = useState(isApprovalNode ? selected.data.label : 'Approval');
  const [description, setDescription] = useState(isApprovalNode ? selected.data.description ?? '' : '');
  const [labelError, setLabelError] = useState<string | undefined>();

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (value.trim()) {
      setLabelError(undefined);
    }
  };

  return (
    <NodeFormPanel
      title="Approval node"
      subtitle="Configure approval gate details"
      nodeType={selected?.type}
      nodeId={selected?.id}
      hasSelection={Boolean(isApprovalNode)}
      validationErrors={isApprovalNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isApprovalNode) return;
        if (!label.trim()) {
          setLabelError('Label is required');
          return;
        }
        updateNode(selected.id, 'approval', {
          label,
          description: description || undefined,
          approverRole: selected.data.approverRole ?? 'Manager',
          requiredApprovalCount: selected.data.requiredApprovalCount ?? 1,
        });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isApprovalNode) return;
        setLabel('Approval');
        setDescription('');
        setLabelError(undefined);
        updateNode(selected.id, 'approval', {
          label: 'Approval',
          description: undefined,
          approverRole: 'Manager',
          requiredApprovalCount: 1,
        });
      }}
      onDelete={() => selected && isApprovalNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={handleLabelChange}
        error={labelError}
        onBlur={() => setLabelError(label.trim() ? undefined : 'Label is required')}
      />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
