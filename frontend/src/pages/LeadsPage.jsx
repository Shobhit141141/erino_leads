import React, { useMemo, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads, createLead, updateLead, deleteLead, bulkDeleteLeads, bulkCreateLeads } from '../api/lead';
import {
  Button, Group, Modal, TextInput, NumberInput,
  Select, Badge, Menu, ActionIcon, TextInput as MantineInput,
  Paper,
  Text,
  FileInput,
  Checkbox
} from '@mantine/core';
import { toast } from 'react-toastify';
import { AllCommunityModule, ModuleRegistry, themeQuartz, colorSchemeDark } from 'ag-grid-community';
import { IconDotsVertical, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';
import { FaAngleLeft, FaAngleRight, FaRegSquarePlus } from "react-icons/fa6";
import { PiExportBold } from "react-icons/pi";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { BsFiletypeJson } from "react-icons/bs";
import { TbReload } from "react-icons/tb";


ModuleRegistry.registerModules([AllCommunityModule]);

const statusOptions = [
  'new', 'contacted', 'qualified', 'lost', 'won'
].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

const sourceOptions = [
  'website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'
].map(v => ({ value: v, label: v.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }));

const statusColorMap = {
  new: 'blue',
  contacted: 'orange',
  qualified: 'green',
  lost: 'red',
  won: 'grape'
};

const myTheme = themeQuartz.withPart(colorSchemeDark);

export default function LeadsPage() {
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['leads', pagination],
    queryFn: async () => {
      const res = await fetchLeads({
        page: pagination.page,
        limit: pagination.pageSize
      });
      return res;
    },
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error deleting lead');
    }
  };

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', company: '', city: '', state: '',
    source: '', status: '', score: 0, lead_value: 0, last_activity_at: '', is_qualified: false
  });

  const columns = useMemo(() => [
    { checkboxSelection: true, headerCheckboxSelection: true, width: 80 },
    { headerName: 'ID', field: 'id', width: 90, sortable: true, filter: true },
    { headerName: 'First Name', field: 'first_name', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'last_name', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    { headerName: 'Company', field: 'company', sortable: true, filter: true },
    { headerName: 'City', field: 'city', sortable: true, filter: true },
    { headerName: 'State', field: 'state', sortable: true, filter: true },
    { headerName: 'Source', field: 'source', sortable: true, filter: true },
    {
      headerName: 'Status', field: 'status', sortable: true, filter: true,
      cellRenderer: params => (
        <Badge color={statusColorMap[params.value]} variant='light'>{params.value}</Badge>
      )
    },
    { headerName: 'Score', field: 'score', width: 90, sortable: true, filter: true },
    { headerName: 'Lead Value', field: 'lead_value', width: 110, sortable: true, filter: true },
    { headerName: 'Qualified', field: 'is_qualified', width: 100, valueFormatter: p => p.value ? 'Yes' : 'No', sortable: true, filter: true },
    { headerName: 'Last Activity', field: 'last_activity_at', width: 140, sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: params => (
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle"><IconDotsVertical size={16} /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={16} />} onClick={() => handleEdit(params.data)}>Edit</Menu.Item>
            <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={() => handleDelete(params.data.id)}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
      width: 100
    }
  ], []);

  function handleEdit(lead) {
    setEditLead(lead);
    setForm({ ...lead });
    setModalOpen(true);
  }

  function handleCreate() {
    setEditLead(null);
    setForm({
      first_name: '', last_name: '', email: '', phone: '', company: '', city: '', state: '',
      source: '', status: '', score: 0, lead_value: 0, last_activity_at: '', is_qualified: false
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editLead) {
        await updateLead({ id: editLead.id, ...form });
        toast.success('Lead updated');
      } else {
        await createLead(form);
        toast.success('Lead created');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error');
    }
  }

  const handleExport = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const handleBulkDelete = () => {
    const selectedIds = gridRef.current.api.getSelectedRows().map(row => row.id);
    if (selectedIds.length === 0) {
      toast.error('No leads selected');
      return;
    }
    bulkDeleteLeads(selectedIds).then(() => {
      toast.success('Leads deleted');
      refetch();
    }).catch(err => {
      toast.error(err?.response?.data?.message || 'Error deleting leads');
    });
  };

  const handleImportFromJson = async (file) => {
    if (!file) return;

    try {
      const text = await file.text();
      const leads = JSON.parse(text);

      if (!Array.isArray(leads)) {
        toast.error('JSON must be an array of leads');
        setFileInputKey(prev => prev + 1);
        return;
      }

      await bulkCreateLeads({ leads });
      toast.success(`${leads.length} leads imported successfully`);
      refetch();
      setFileInputKey(prev => prev + 1);

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid JSON or error importing leads');
      console.error('Import error:', err);
      setFileInputKey(prev => prev + 1);
    }
  };
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination({ page: 1, pageSize: newPageSize });
  }, []);

  const totalPages = data ? Math.ceil(data.total / pagination.pageSize) : 1;
  const startRecord = data ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const endRecord = data ? Math.min(pagination.page * pagination.pageSize, data.total) : 0;

  return (
    <div>
      <Group position="apart" className="mb-4">
        <Group>
          <Button color='cyan' onClick={handleCreate} leftSection={<FaRegSquarePlus />}>
            Create Lead
          </Button>
          <Button variant="light" color='cyan' onClick={handleExport}>
            <PiExportBold className='mr-2' />
            Export CSV
          </Button>

          <FileInput
            key={fileInputKey}
            placeholder="Import leads JSON"
            onChange={handleImportFromJson}
            accept=".json"
            leftSection={<BsFiletypeJson className='text-[#66d9e8]' />}
            variant='filled'
          />

          {selectedRows.length > 0 && (
            <Button variant="light" color='red' onClick={handleBulkDelete}>
              <BiSolidTrashAlt className='mr-2' />
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          {/* 
          <Button variant='light' color='gray' onClick={() => refetch()}>
            <TbReload className='' />
          </Button> */}
        </Group>
      </Group>

      <div style={{ width: '100%', height: '600px' }}>
        <AgGridReact
          ref={gridRef}
          rowData={data?.data || []}
          columnDefs={columns}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          domLayout='normal'
          suppressCellFocus
          enableBrowserTooltips={true}
          animateRows
          theme={myTheme}
          loading={isLoading}
          pagination={false}
          rowSelection="multiple"
          onSelectionChanged={() => {
            const rows = gridRef.current.api.getSelectedRows();
            setSelectedRows(rows);
          }}
        />

        <div

          className='bg-[#2f2f2f] px-4 py-2 mt-2 rounded-lg shadow-md'
        >
          <Group position="apart" align="center">
            <Group spacing="lg" align="center">
              <Text size="sm" color="gray.4">
                Showing {startRecord}-{endRecord} of {data?.total || 0} leads
              </Text>

              <Group spacing="xs" align="center">
                <Text size="sm" color="gray.4">
                  Page size:
                </Text>
                <Select
                  value={String(pagination.pageSize)}
                  onChange={(val) => handlePageSizeChange(Number(val))}
                  data={[
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                  ]}
                  size="xs"
                  styles={{
                    input: {
                      backgroundColor: "#1f1f1f",
                      borderColor: "#444",
                      color: "#ddd",
                    },
                  }}
                />
              </Group>
            </Group>

            <Group spacing="xs" align="center">
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftSection={<FaAngleDoubleLeft />}
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
              >
                First
              </Button>

              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftSection={<FaAngleLeft />}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Prev
              </Button>

              <Text size="sm" color="gray.3">
                Page {pagination.page} of {totalPages}
              </Text>

              <Button
                variant="subtle"
                color="gray"
                size="xs"
                rightSection={<FaAngleRight />}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages || totalPages === 0}
              >
                Next
              </Button>

              <Button
                variant="subtle"
                color="gray"
                size="xs"
                rightSection={<FaAngleDoubleRight />}
                onClick={() => handlePageChange(totalPages)}
                disabled={pagination.page === totalPages || totalPages === 0}
              >
                Last
              </Button>
            </Group>
          </Group>
        </div>
      </div>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editLead ? 'Edit Lead' : 'Create Lead'}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Group grow>
            <TextInput label="First Name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
            <TextInput label="Last Name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          </Group>
          <TextInput label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required type="email" />
          <TextInput label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          <TextInput label="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
          <Group grow>
            <TextInput label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
            <TextInput label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
          </Group>
          <Group grow>
            <Select label="Source" data={sourceOptions} value={form.source} onChange={v => setForm(f => ({ ...f, source: v }))} required />
            <Select label="Status" data={statusOptions} value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} required />
          </Group>
          <Group grow>
            <NumberInput label="Score" value={form.score} onChange={v => setForm(f => ({ ...f, score: v }))} min={0} max={100} required />
            <NumberInput label="Lead Value" value={form.lead_value} onChange={v => setForm(f => ({ ...f, lead_value: v }))} min={0} required />
          </Group>
          <TextInput label="Last Activity At" value={form.last_activity_at || ''} onChange={e => setForm(f => ({ ...f, last_activity_at: e.target.value }))} placeholder="YYYY-MM-DD" />
          <label className="flex items-center gap-2">
            <Checkbox checked={form.is_qualified} onChange={e => setForm(f => ({ ...f, is_qualified: e.target.checked }))} color='cyan'/> Qualified
          </label>
          <Button type="submit" color='cyan' fullWidth>{editLead ? 'Update' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  );
}