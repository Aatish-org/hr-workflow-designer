import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function AutomatedStepNodeForm() {
  const { getSelectedNode, updateNode, deleteNode } = useWorkflowStore();
  const selected = getSelectedNode();
  const isAutomatedStepNode = selected?.type === 'automatedStep';
  const label = isAutomatedStepNode ? selected.data.label : 'Automated Step';
  const description = isAutomatedStepNode ? selected.data.description ?? '' : '';

  return (
    <NodeFormPanel
      title="Automated step node"
      subtitle="Configure automation details"
      hasSelection={Boolean(isAutomatedStepNode)}
      onSubmit={() => selected && isAutomatedStepNode && updateNode(selected.id, { label, description: description || undefined })}
      onReset={() => selected && isAutomatedStepNode && updateNode(selected.id, { label: 'Automated Step', description: undefined })}
      onDelete={() => selected && isAutomatedStepNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={(value) => selected && isAutomatedStepNode && updateNode(selected.id, { ...selected.data, label: value })}
      />
      <ControlledField
        label="Description"
        value={description}
        onChange={(value) => selected && isAutomatedStepNode && updateNode(selected.id, { ...selected.data, description: value })}
        placeholder="Optional"
      />
    </NodeFormPanel>
  );
}
