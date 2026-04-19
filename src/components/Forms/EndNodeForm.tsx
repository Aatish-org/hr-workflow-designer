import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function EndNodeForm() {
  const { getSelectedNode, updateNode, deleteNode } = useWorkflowStore();
  const selected = getSelectedNode();
  const isEndNode = selected?.type === 'end';
  const label = isEndNode ? selected.data.label : 'End';
  const description = isEndNode ? selected.data.description ?? '' : '';

  return (
    <NodeFormPanel
      title="End node"
      subtitle="Finalize the workflow exit step"
      hasSelection={Boolean(isEndNode)}
      onSubmit={() => selected && isEndNode && updateNode(selected.id, { label, description: description || undefined })}
      onReset={() => selected && isEndNode && updateNode(selected.id, { label: 'End', description: undefined })}
      onDelete={() => selected && isEndNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={(value) => selected && isEndNode && updateNode(selected.id, { ...selected.data, label: value })}
      />
      <ControlledField
        label="Description"
        value={description}
        onChange={(value) => selected && isEndNode && updateNode(selected.id, { ...selected.data, description: value })}
        placeholder="Optional"
      />
    </NodeFormPanel>
  );
}
