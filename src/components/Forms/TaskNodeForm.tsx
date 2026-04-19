import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function TaskNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isTaskNode = selected?.type === 'task';
  const [label, setLabel] = useState(isTaskNode ? selected.data.label : 'Task');
  const [description, setDescription] = useState(isTaskNode ? selected.data.description ?? '' : '');

  return (
    <NodeFormPanel
      title="Task node"
      subtitle="Edit the task title and description"
      hasSelection={Boolean(isTaskNode)}
      validationErrors={isTaskNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isTaskNode) return;
        updateNode(selected.id, 'task', { label, description: description || undefined, assignee: selected.data.assignee ?? 'HR' });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isTaskNode) return;
        setLabel('Task');
        setDescription('');
        updateNode(selected.id, 'task', { label: 'Task', description: undefined, assignee: 'HR' });
      }}
      onDelete={() => selected && isTaskNode && deleteNode(selected.id)}
    >
      <ControlledField label="Label" value={label} onChange={setLabel} />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
