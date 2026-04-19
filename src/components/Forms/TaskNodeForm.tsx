import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function TaskNodeForm() {
  const { getSelectedNode, updateNode, deleteNode } = useWorkflowStore();
  const selected = getSelectedNode();
  const isTaskNode = selected?.type === 'task';
  const label = isTaskNode ? selected.data.label : 'Task';
  const description = isTaskNode ? selected.data.description ?? '' : '';

  return (
    <NodeFormPanel
      title="Task node"
      subtitle="Edit the task title and description"
      hasSelection={Boolean(isTaskNode)}
      onSubmit={() => selected && isTaskNode && updateNode(selected.id, { label, description: description || undefined })}
      onReset={() => selected && isTaskNode && updateNode(selected.id, { label: 'Task', description: undefined })}
      onDelete={() => selected && isTaskNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={(value) => selected && isTaskNode && updateNode(selected.id, { ...selected.data, label: value })}
      />
      <ControlledField
        label="Description"
        value={description}
        onChange={(value) => selected && isTaskNode && updateNode(selected.id, { ...selected.data, description: value })}
        placeholder="Optional"
      />
    </NodeFormPanel>
  );
}
