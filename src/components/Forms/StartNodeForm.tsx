import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function StartNodeForm() {
  const { getSelectedNode, updateNode, deleteNode } = useWorkflowStore();
  const selected = getSelectedNode();
  const isStartNode = selected?.type === 'start';
  const label = isStartNode ? selected.data.label : 'Start';
  const description = isStartNode ? selected.data.description ?? '' : '';

  return (
    <NodeFormPanel
      title="Start node"
      subtitle="Configure the starting step of the workflow"
      hasSelection={Boolean(isStartNode)}
      onSubmit={() => selected && isStartNode && updateNode(selected.id, { label, description: description || undefined })}
      onReset={() => selected && isStartNode && updateNode(selected.id, { label: 'Start', description: undefined })}
      onDelete={() => selected && isStartNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={(value) => selected && isStartNode && updateNode(selected.id, { ...selected.data, label: value })}
      />
      <ControlledField
        label="Description"
        value={description}
        onChange={(value) => selected && isStartNode && updateNode(selected.id, { ...selected.data, description: value })}
        placeholder="Optional"
      />
    </NodeFormPanel>
  );
}
