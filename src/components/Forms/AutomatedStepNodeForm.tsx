import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function AutomatedStepNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isAutomatedStepNode = selected?.type === 'automatedStep';
  const [label, setLabel] = useState(isAutomatedStepNode ? selected.data.label : 'Automated Step');
  const [description, setDescription] = useState(isAutomatedStepNode ? selected.data.description ?? '' : '');

  return (
    <NodeFormPanel
      title="Automated step node"
      subtitle="Configure automation details"
      hasSelection={Boolean(isAutomatedStepNode)}
      validationErrors={isAutomatedStepNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isAutomatedStepNode) return;
        updateNode(selected.id, 'automatedStep', {
          label,
          description: description || undefined,
          automationKey: selected.data.automationKey ?? 'provision-access',
        });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isAutomatedStepNode) return;
        setLabel('Automated Step');
        setDescription('');
        updateNode(selected.id, 'automatedStep', {
          label: 'Automated Step',
          description: undefined,
          automationKey: 'provision-access',
        });
      }}
      onDelete={() => selected && isAutomatedStepNode && deleteNode(selected.id)}
    >
      <ControlledField label="Label" value={label} onChange={setLabel} />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
