import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { userService, assignmentService } from '../../services'

const statusBadge = (status = '') => {
  const s = (status || '').toLowerCase().replace(/[_-]/g, ' ').trim()
  const map = {
    pending: { bg: '#fff7ed', color: '#d97706' },
    completed: { bg: '#f0fdf4', color: '#16a34a' }
  }
  const style = map[s] || { bg: '#f1f5f9', color: '#475569' }
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/[_]/g, ' ') : 'N/A'
  return (
    <span style={{ background: style.bg, color: style.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{label}</span>
  )
}

const getStatus = (item) => {
  const hasIssueDate = !!(item?.issued_on || item?.issue_date)
  const hasDueDate = !!(item?.due_date || item?.response_due_date)
  if (hasIssueDate && hasDueDate) return 'Completed'
  if (hasIssueDate && !hasDueDate) return 'Pending'
  if (item?.is_completed || (item?.status || '').toLowerCase() === 'completed') return 'Completed'
  return item?.status || item?.workflow_status || 'Pending'
}

export default function AdminDashboard() {
  const mockClients = [
    {
      id: 1,
      name: 'GOWRA LAKSHMI NARAYANA ARVIND',
      pan: 'AJYPG4906C',
      assessment_year: '2026-27',
      assigned_professional: 'Sri P V Raghavendra Rao',
      status: 'Active'
    },
    {
      id: 2,
      name: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
      pan: 'AAAFE2892E',
      assessment_year: '2024-25',
      assigned_professional: 'Sri Eshwar Krishna',
      status: 'Active'
    },
    {
      id: 3,
      name: 'GIRIDHAR REDDY NANDARAM',
      pan: 'ACRPN2868E',
      assessment_year: 'N/A',
      assigned_professional: 'Sri P V Raghavendra Rao',
      status: 'Active'
    },
    {
      id: 4,
      name: 'SUDHAKAR SAYE',
      pan: 'CXVPS8457F',
      assessment_year: '2018-19',
      assigned_professional: 'Sri Sayyad Sadk',
      status: 'Active'
    },
    {
      id: 5,
      name: 'KAKARLA JAGANNATHA',
      pan: 'AEUPJ0345R',
      assessment_year: 'N/A',
      assigned_professional: 'Sri P V Raghavendra Rao',
      status: 'Active'
    },
    {
      id: 6,
      name: 'LAXMI DEVI GUPTA',
      pan: 'ABHPG8046Q',
      assessment_year: '2014-15',
      assigned_professional: 'Sri P V Raghavendra Rao',
      status: 'Active'
    },
    {
      id: 7,
      name: 'FATIMA CONVENT ASSOCIATION',
      pan: 'AAATF2458F',
      assessment_year: '-',
      assigned_professional: 'Sri Eshwar Krishna',
      status: 'Assigned'
    },
    {
      id: 8,
      name: 'Babuji Vanacharla',
      pan: 'AHMPV4480E',
      assessment_year: '2021-22',
      assigned_professional: 'Sri Eshwar Krishna',
      status: 'Assigned'
    },
    {
      id: 9,
      name: 'SRI PADMAVATHI EDUCATIONAL SOCIETY',
      pan: 'AAAAS7154E',
      assessment_year: '2023-24',
      assigned_professional: 'Sri Sayyad Sadk',
      status: 'Assigned'
    }
  ];

  const [clients, setClients] = useState(mockClients)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // keeping effect empty as we use mock data
  }, [])

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    const nameMatch = (c.name || '').toLowerCase().includes(q)
    const panMatch = (c.pan || '').toLowerCase().includes(q)
    const profMatch = ((c.assigned_professional?.professional_name || c.assigned_professional) || '').toLowerCase().includes(q)
    return nameMatch || panMatch || profMatch
  })

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Admin Dashboard' }]}>
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', width: '100%', flex: 1 }}>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Admin Dashboard</h1>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: 320 }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search Assessee, PAN, or Professional..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            {/* Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', width: '100%', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Assessee', 'PAN', 'Assessment Year', 'Assigned Professional', 'Status', 'Proceedings'].map(h => (
                <div key={h} style={{ padding: '14px 28px', color: '#64748b', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', textAlign: 'left' }}>{h}</div>
              ))}
            </div>

            {/* Data Rows */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>No data found.</div>
            ) : (
              filtered.map((c, i) => (
                <div key={c.id || i} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', width: '100%', borderBottom: '0.5px solid #f1f5f9', alignItems: 'center' }}>
                  <div style={{ padding: '14px 28px', fontWeight: 600 }}>
                    <span style={{ fontSize: 14, color: '#1e293b' }}>{c.name}</span>
                  </div>
                  <div style={{ padding: '14px 28px', color: '#64748b', fontSize: 14 }}>{c.pan}</div>
                  <div style={{ padding: '14px 28px', color: '#475569', fontWeight: 500, fontSize: 14 }}>{c.assessment_year}</div>
                  <div style={{ padding: '14px 28px', color: '#1e3a8a', fontWeight: 500, fontSize: 14 }}>
                    {c.assigned_professional?.professional_name || c.assigned_professional || '—'}
                  </div>
                  <div style={{ padding: '14px 28px' }}>{statusBadge(getStatus(c))}</div>
                  <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          navigate(`/proceedings?assessee=${encodeURIComponent(c.name)}&uid=11&tab=action`)
                        }}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '7px 16px',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                      >
                        View Notice
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
