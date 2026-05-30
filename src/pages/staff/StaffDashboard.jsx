import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, X, Calendar } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { dashboardService, noticeService } from '../../services'


// Status: issue+due=Completed, issue only=Pending, fallback to API status
const getStatus = (item) => {
  const hasIssueDate = !!(item?.issued_on || item?.issue_date)
  const hasDueDate = !!(item?.due_date || item?.response_due_date)
  if (hasIssueDate && hasDueDate) return 'Completed'
  if (hasIssueDate && !hasDueDate) return 'Pending'
  if (item?.is_completed || (item?.status || '').toLowerCase() === 'completed') return 'Completed'
  return item?.status || item?.workflow_status || 'Pending'
}

const defaultAssignments = [
  {
    notice_id: 1,
    id: 1,
    user: 'LAXMI DEVI GUPTA',
    user_name: 'LAXMI DEVI GUPTA',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2014-15',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2026-05-04',
    due_date: '2026-05-13',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 2,
    id: 2,
    user: 'Babuji Vanacharla',
    user_name: 'Babuji Vanacharla',
    proceeding_name: 'Assessment Proceeding u/s 147',
    assessment_year: '2021-22',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-04-24',
    due_date: '2026-05-08',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 3,
    id: 3,
    user: 'Babuji Vanacharla',
    user_name: 'Babuji Vanacharla',
    proceeding_name: 'Assessment Proceeding u/s 147',
    assessment_year: '2021-22',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-04-22',
    due_date: '2026-05-07',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 4,
    id: 4,
    user: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    user_name: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    proceeding_name: 'Penalty Proceeding',
    assessment_year: '2024-25',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-03-24',
    due_date: '2026-03-31',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 5,
    id: 5,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'Issue Letter',
    assessment_year: '2026-27',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2026-03-09',
    due_date: '-',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 6,
    id: 6,
    user: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    user_name: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2024-25',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-03-01',
    due_date: '-',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 7,
    id: 7,
    user: 'FATIMA CONVENT ASSOCIATION',
    user_name: 'FATIMA CONVENT ASSOCIATION',
    proceeding_name: 'Issue Letter',
    assessment_year: '-',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-02-19',
    due_date: '-',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 8,
    id: 8,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2024-25',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2026-02-17',
    due_date: '2026-03-04',
    status: 'Pending',
    is_read: true
  },
  {
    notice_id: 9,
    id: 9,
    user: 'Babuji Vanacharla',
    user_name: 'Babuji Vanacharla',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2020-21',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-02-02',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 10,
    id: 10,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2024-25',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2026-02-01',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 11,
    id: 11,
    user: 'FATIMA CONVENT ASSOCIATION',
    user_name: 'FATIMA CONVENT ASSOCIATION',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2023-24',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-01-28',
    due_date: '2026-02-04',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 12,
    id: 12,
    user: 'LAXMI DEVI GUPTA',
    user_name: 'LAXMI DEVI GUPTA',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2014-15',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2026-01-28',
    due_date: '2026-02-04',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 13,
    id: 13,
    user: 'Babuji Vanacharla',
    user_name: 'Babuji Vanacharla',
    proceeding_name: 'First Appeal Proceedings',
    assessment_year: '2020-21',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-01-08',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 14,
    id: 14,
    user: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    user_name: 'ELECTRICAL TESTING & SERVICE ENGINEERING',
    proceeding_name: 'Penalty Proceeding',
    assessment_year: '2024-25',
    assigned_professional: 'Sri Eshwar Krishna',
    issued_on: '2026-01-07',
    due_date: '2026-01-30',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 15,
    id: 15,
    user: 'LAXMI DEVI GUPTA',
    user_name: 'LAXMI DEVI GUPTA',
    proceeding_name: 'Issue Letter',
    assessment_year: '-',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2025-01-24',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 16,
    id: 16,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'Issue Letter',
    assessment_year: '2025-26',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2024-09-12',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 17,
    id: 17,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'Issue Letter',
    assessment_year: '-',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2023-09-08',
    due_date: '-',
    status: 'Pending',
    is_read: false
  },
  {
    notice_id: 18,
    id: 18,
    user: 'GOWRA LAKSHMI NARAYANA ARVIND',
    user_name: 'GOWRA LAKSHMI NARAYANA ARVIND',
    proceeding_name: 'Issue Letter',
    assessment_year: '2023-24',
    assigned_professional: 'Sri P V Raghavendra Rao',
    issued_on: '2023-03-09',
    due_date: '-',
    status: 'Pending',
    is_read: false
  }
]

export default function StaffDashboard() {
  const [summary, setSummary] = useState({ total_notices: 18, pending_notices: 10, completed_notices: 8 })
  const [assignments, setAssignments] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ month: '', year: '', assessment: '' })
  const [appliedFilters, setAppliedFilters] = useState({ month: '', year: '', assessment: '' })
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allNotices, setAllNotices] = useState([])
  const [allNoticesLoaded, setAllNoticesLoaded] = useState(false)
  const [recentNotices, setRecentNotices] = useState([])
  const [recentMeta, setRecentMeta] = useState({})
  const [recentLoading, setRecentLoading] = useState(false)
  const [recentError, setRecentError] = useState(null)
  const [recentOffset, setRecentOffset] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readNoticeIds = JSON.parse(localStorage.getItem('readNoticeIds') || '[]')

        // Set baseline summary
        setSummary({ total_notices: 18, pending_notices: 10, completed_notices: 8 })

        // Initialize assignments and recent notices with default assignments
        const mapped = defaultAssignments.map(n => {
          const noticeId = n.notice_id ?? n.id
          const permanentlyRead = readNoticeIds.includes(noticeId)
          return {
            ...n,
            is_read: permanentlyRead || !!n.is_read
          }
        })

        setRecentNotices(mapped)
        setAssignments(mapped)
        setAllNotices(mapped)
        setAllNoticesLoaded(true)

      } catch (err) {
        // silent error handling
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Listen for assignment changes from other pages (e.g., Clients.jsx)
    const onAssigned = (e) => {
      try {
        const detail = e?.detail || {}
        const { userId, professionalName } = detail
        if (!userId) return

        const updateAssigned = (list) => list.map(item => {
          const matchesUser = (
            item.client?.id === userId ||
            item.client_id === userId ||
            item.user_id === userId ||
            item.user === userId ||
            String(item.client?.id) === String(userId) ||
            String(item.user).toLowerCase() === String(userId).toLowerCase() ||
            String(item.user_name).toLowerCase() === String(userId).toLowerCase()
          )
          if (matchesUser) return { ...item, assigned_professional: professionalName }
          return item
        })

        setAssignments(prev => Array.isArray(prev) ? updateAssigned(prev) : prev)
        setAllNotices(prev => Array.isArray(prev) ? updateAssigned(prev) : prev)
        setRecentNotices(prev => Array.isArray(prev) ? updateAssigned(prev) : prev)
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('professionalAssigned', onAssigned)
    return () => window.removeEventListener('professionalAssigned', onAssigned)
  }, [])


  const handleViewNotice = async (a) => {
    const noticeId = a.notice_id ?? a.id
    try {
      if (noticeId) {
        await dashboardService.markNoticeRead(noticeId)
      }
    } catch (err) {
      console.warn("Failed to mark notice as read on backend", err)
    }

    if (noticeId) {
      const readNoticeIds = JSON.parse(localStorage.getItem('readNoticeIds') || '[]')
      if (!readNoticeIds.includes(noticeId)) {
        readNoticeIds.push(noticeId)
        localStorage.setItem('readNoticeIds', JSON.stringify(readNoticeIds))
      }

      setAssignments(prev => prev.map(item => (item.notice_id === noticeId || item.id === noticeId) ? { ...item, is_read: true } : item))
      setAllNotices(prev => prev.map(item => (item.notice_id === noticeId || item.id === noticeId) ? { ...item, is_read: true } : item))
    }
    navigate(`/staff/notice-orders/${noticeId}`)
  }

  const isAllFilter = (val) => !val || String(val).trim() === '' || String(val).trim().toLowerCase() === 'all'
  const sourceData = assignments

  // Keep unread count in sync with what's visible
  useEffect(() => {
    const count = sourceData.filter(n => !n.is_read).length
    setUnreadCount(count)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, appliedFilters])

  const filtered = sourceData.filter(a => {
    const term = search.trim().toLowerCase()

    // Search filter
    const matchesSearch = !term || (() => {
      const userName = (a?.user || a?.user_name || '').toLowerCase()
      const referenceId = (a?.reference_id || `REF-${a?.notice_id}`).toLowerCase()
      const noticeId = String(a?.notice_id ?? '')
      return userName.includes(term) || referenceId.includes(term) || noticeId.includes(term)
    })()

    // Filter by Month, Year, Assessment
    let assignedDate = null
    if (a?.issued_on && a?.issued_on !== '-') {
      if (a.issued_on.includes('/')) {
        const parts = a.issued_on.split('/')
        if (parts.length === 3) {
          assignedDate = new Date(parts[2], parts[1] - 1, parts[0])
        }
      } else {
        assignedDate = new Date(a.issued_on)
      }
    }
    const matchesMonth = isAllFilter(appliedFilters.month) || (assignedDate && assignedDate.getMonth() + 1 === parseInt(appliedFilters.month))
    const matchesYear = isAllFilter(appliedFilters.year) || (assignedDate && assignedDate.getFullYear() === parseInt(appliedFilters.year))
    
    const status = (a?.status || '').toLowerCase()
    const matchesAssessment = isAllFilter(appliedFilters.assessment) || status === appliedFilters.assessment.toLowerCase()

    return matchesSearch && matchesMonth && matchesYear && matchesAssessment
  })

  const handleClearFilters = () => {
    setFilters({ month: '', year: '', assessment: '' })
    setAppliedFilters({ month: '', year: '', assessment: '' })
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters })
    setShowFilterPanel(false)
  }

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarColors = ['#7c3aed', '#059669', '#16a34a', '#ea580c', '#1d4ed8', '#dc2626']
  const colorFor = (i) => avatarColors[i % avatarColors.length]

  const formatDate = (date) => {
    if (!date || date === '-' || date === 'n/a' || date === '—') return '-'
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date

    try {
      let d = new Date(date)
      if (isNaN(d.getTime())) {
        if (date.includes('-')) {
          const parts = date.split('-')
          if (parts.length === 3 && parts[0].length === 4) {
            d = new Date(parts[0], parts[1] - 1, parts[2])
          }
        }
      }
      if (isNaN(d.getTime())) {
        return date
      }
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return date
    }
  }

  const mapNotice = (item) => ({
    id: item.id ?? item.notice_id,
    title: item.proceeding_name || item.notice_type || `Notice ${item.notice_id ?? item.id}`,
    summary: item.reference_id ? `${item.reference_id} • ${item.user_name || ''}`.trim() : (item.status || ''),
    body: item.body ?? null,
    type: item.notice_type ?? 'notification',
    severity: item.severity ?? 'info',
    relatedUrl: item.view_notice?.proceeding_id ? `/staff/proceeding/${item.view_notice.proceeding_id}` : `/staff/notice-orders/${item.notice_id ?? item.id}`,
    isRead: !!item.is_read || !!item.isRead || false,
    createdAt: item.issued_on || item.createdAt || item.created_at || null,
  })

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div style={{ padding: '20px 22px' }}>

        {/* Assignments table */}
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, overflow: 'visible' }}>
          <div style={{ padding: '14px 18px', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>My Assignments</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Managing notification workflow and compliance deadlines</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto', minWidth: 280 }}>
              {/* Search Bar */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px', background: '#fff', boxSizing: 'border-box', minWidth: 280 }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: 11,
                    color: '#1e293b',
                    background: 'transparent'
                  }}
                />
              </div>

              {/* Filter Icon Button */}
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  background: showFilterPanel ? '#e0e7ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Filter by issued date"
              >
                <Filter size={18} color={showFilterPanel ? '#2563eb' : '#64748b'} />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Month:</label>
                <select
                  value={filters.month}
                  onChange={e => setFilters({ ...filters, month: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#1e293b',
                    background: '#fff',
                    minWidth: 140,
                    cursor: 'pointer'
                  }}
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Year:</label>
                <select
                  value={filters.year}
                  onChange={e => setFilters({ ...filters, year: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#1e293b',
                    background: '#fff',
                    minWidth: 100,
                    cursor: 'pointer'
                  }}
                >
                  <option value="">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Assessment:</label>
                <select
                  value={filters.assessment}
                  onChange={e => setFilters({ ...filters, assessment: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#1e293b',
                    background: '#fff',
                    minWidth: 140,
                    cursor: 'pointer'
                  }}
                >
                  <option value="">All Assessments</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleApplyFilters}
                  style={{
                    padding: '6px 12px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.15)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb' }}
                >
                  Apply
                </button>
                <button
                  onClick={handleClearFilters}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '14%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['User', 'Proceeding Name', 'Assessment Year', 'Assigned Professional', 'Issued On', 'Due Date', 'Notice'].map(h => (
                    <th key={h} style={{ background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', padding: '10px 10px', borderBottom: '0.5px solid #e2e8f0', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontSize: 11 }}>Loading assignments...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#94a3b8', fontSize: 11 }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr key={a.notice_id || i} style={{ borderBottom: '0.5px solid #f1f5f9', background: !a.is_read ? '#e0f2fe' : 'transparent', transition: 'all 0.3s ease' }}>
                      <td style={{ padding: '11px 10px', color: '#1e293b', verticalAlign: 'middle', borderLeft: !a.is_read ? '4px solid #2563eb' : '4px solid transparent', transition: 'border-left-color 0.3s ease', fontSize: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {!a.is_read && (
                            <span 
                              style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                boxShadow: '0 0 8px #3b82f6',
                                flexShrink: 0
                              }} 
                              title="New/Unread"
                            />
                          )}
                          <span style={{ fontWeight: !a.is_read ? 700 : 500 }}>{a?.user || a?.user_name || "N/A"}</span>
                        </div>
                      </td>
                      <td
                        style={{ padding: '11px 10px', fontWeight: !a.is_read ? 700 : 600, color: !a.is_read ? '#1e293b' : '#334155', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}
                        onClick={() => {
                          const isInfo = (a.status || '').toLowerCase() === 'completed' || (a.status || '').toLowerCase() === 'closed'
                          navigate(`/staff/notices?assessee=${encodeURIComponent(a?.assessee_name || a?.user || a?.user_name || '')}&tab=${isInfo ? 'info' : 'action'}`, { state: { assesseeName: a?.assessee_name || a?.user || a?.user_name || '' } })
                        }}
                        title="Click to view e-Proceeding"
                      >
                        {a.proceeding_name}
                      </td>
                      <td style={{ padding: '11px 10px', color: '#64748b', fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.assessment_year || 'N/A'}
                      </td>
                      <td style={{ padding: '11px 10px', color: '#2563eb', fontWeight: !a.is_read ? '600' : '500', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.assigned_professional || '—'}
                      </td>
                      <td style={{ padding: '10px 10px', color: '#64748b', fontWeight: !a.is_read ? '600' : 'normal', fontSize: 12 }}>
                        {a?.issued_on && a.issued_on !== '-' ? formatDate(a.issued_on) : "-"}
                      </td>
                      <td style={{ padding: '10px 10px', color: '#dc2626', fontWeight: !a.is_read ? 700 : 500, fontSize: 12 }}>
                        {a?.due_date && a.due_date !== '-' ? formatDate(a.due_date) : "-"}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <button
                          onClick={() => handleViewNotice(a)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: '600', cursor: 'pointer', boxShadow: !a.is_read ? '0 2px 4px rgba(30, 58, 138, 0.25)' : 'none', transition: 'all 0.2s ease' }}
                        >
                          VIEW NOTICE
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '0.5px solid #f1f5f9' }}>
            <p style={{ fontSize: 11, color: '#64748b' }}>Showing {filtered.length} of {summary?.total_notices ?? filtered.length} assignments</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {['‹', '›'].map(ch => (
                <button key={ch} style={{ width: 28, height: 28, border: '0.5px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{ch}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
