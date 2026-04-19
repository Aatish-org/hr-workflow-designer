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
  const [labelError, setLabelError] = useState<string | undefined>();

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (value.trim()) {
      setLabelError(undefined);
    }
  };

  return (
    <NodeFormPanel
      title="Automated step node"
      subtitle="Configure automation details"
      nodeType={selected?.type}
      nodeId={selected?.id}
      hasSelection={Boolean(isAutomatedStepNode)}
      validationErrors={isAutomatedStepNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isAutomatedStepNode) return;
        if (!label.trim()) {
          setLabelError('Label is required');
          return;
        }
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
        setLabelError(undefined);
        updateNode(selected.id, 'automatedStep', {
          label: 'Automated Step',
          description: undefined,
          automationKey: 'provision-access',
        });
      }}
      onDelete={() => selected && isAutomatedStepNode && deleteNode(selected.id)}
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
