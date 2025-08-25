import { Group, Paper, Text, TextInput, NumberInput, Select, Button } from '@mantine/core';
import { IconFilter, IconFilterOff } from '@tabler/icons-react';
import React, { useMemo } from 'react';

export const FilterStrip = React.memo(({
  showFilters,
  setShowFilters,
  filterProps
}) => {
  const {
    filters,
    handleFilterChange,
    clearFilters,
    applyFilters,
    statusOptions,
    sourceOptions
  } = filterProps;

  const inputStyles = useMemo(() => ({
    input: {
      backgroundColor: "#1f1f1f",
      borderColor: "#444",
      color: "#ddd",
    },
  }), []);

  const dateInputStyle = useMemo(() => ({
    backgroundColor: "#1f1f1f",
    borderColor: "#444",
    color: "#ddd",
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderStyle: "solid",
    width: "100%",
  }), []);

  const hasFilters = useMemo(() => {
    return Object.values(filters).some(value =>
      value !== '' && value !== null && value !== undefined
    );
  }, [filters]);

  return (
    <Paper className="bg-[#2f2f2f] rounded-lg py-2">
      <Group position="apart">

        <Group spacing="xs" className='mb-2'>
          <Button
            variant="light"
            color="cyan"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftSection={<IconFilter size={16} />}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          {hasFilters && (
            <Button
              variant="light"
              color="red"
              size="sm"
              onClick={clearFilters}
              leftSection={<IconFilterOff size={16} />}
            >
              Clear
            </Button>
          )}
        </Group>
      </Group>

      {showFilters && (
        <div className="space-y-4">
          <TextInput
            placeholder="Search leads (name, email, company)"
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            styles={inputStyles}
          />

          <Group grow>
            <Select
              placeholder="Filter by Status"
              value={filters.status}
              onChange={(val) => handleFilterChange('status', val)}
              data={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
              clearable
              styles={inputStyles}
              searchable={false}
            />
            <Select
              placeholder="Filter by Source"
              value={filters.source}
              onChange={(val) => handleFilterChange('source', val)}
              data={[{ value: '', label: 'All Sources' }, ...sourceOptions]}
              clearable
              styles={inputStyles}
              searchable={false}
            />
            <Select
              placeholder="Qualified Status"
              value={filters.is_qualified}
              onChange={(val) => handleFilterChange('is_qualified', val)}
              data={[
                { value: '', label: 'All' },
                { value: 'true', label: 'Qualified' },
                { value: 'false', label: 'Not Qualified' }
              ]}
              clearable
              styles={inputStyles}
              searchable={false}
            />
          </Group>

          <Group grow>
            <TextInput
              placeholder="Filter by City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              styles={inputStyles}
            />
            <TextInput
              placeholder="Filter by Company"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              styles={inputStyles}
            />
            <TextInput
              placeholder="Filter by Email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              styles={inputStyles}
            />
          </Group>

          <Group grow>
            <NumberInput
              placeholder="Min Score"
              value={filters.score_gt}
              onChange={(val) => handleFilterChange('score_gt', val)}
              min={0}
              max={100}
              styles={inputStyles}
            />
            <NumberInput
              placeholder="Max Score"
              value={filters.score_lt}
              onChange={(val) => handleFilterChange('score_lt', val)}
              min={0}
              max={100}
              styles={inputStyles}
            />
            <NumberInput
              placeholder="Min Lead Value"
              value={filters.lead_value_gt}
              onChange={(val) => handleFilterChange('lead_value_gt', val)}
              min={0}
              styles={inputStyles}
            />
            <NumberInput
              placeholder="Max Lead Value"
              value={filters.lead_value_lt}
              onChange={(val) => handleFilterChange('lead_value_lt', val)}
              min={0}
              styles={inputStyles}
            />
          </Group>

          <Group grow>
            <input
              type="date"
              placeholder="Created After"
              value={filters.created_at_after || ''}
              onChange={e => handleFilterChange('created_at_after', e.target.value)}
              style={dateInputStyle}
            />
            <input
              type="date"
              placeholder="Created Before"
              value={filters.created_at_before || ''}
              onChange={e => handleFilterChange('created_at_before', e.target.value)}
              style={dateInputStyle}
            />
            <input
              type="date"
              placeholder="Last Activity After"
              value={filters.last_activity_at_after || ''}
              onChange={e => handleFilterChange('last_activity_at_after', e.target.value)}
              style={dateInputStyle}
            />
            <input
              type="date"
              placeholder="Last Activity Before"
              value={filters.last_activity_at_before || ''}
              onChange={e => handleFilterChange('last_activity_at_before', e.target.value)}
              style={dateInputStyle}
            />
          </Group>

          <Group position="center" className="mt-4 mb-2">
            <Button
              color="cyan"
              onClick={applyFilters}
              disabled={!hasFilters}
              leftSection={<IconFilter size={16} />}
            >
              Apply Filters ({Object.values(filters).filter(value => value !== '' && value !== null && value !== undefined).length})
            </Button>
          </Group>
        </div>
      )}
    </Paper>
  );
});