import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material'
import { 
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'

import { clientStoreService } from '../services/clientStore'

interface NewEarningData {
  riderId: string;
  storeId: string;
  orderId: string;
  orderValue: number;
  orderDate: Date;
  paymentStatus: string;
  baseRate: number;
  baseEarning: number;
  distanceBonus: number;
  timeBonus: number;
  storeOfferBonus: number;
  evBonus: number;
  peakTimeBonus: number;
  qualityBonus: number;
  additionalBonus: number;
}

const defaultNewEarning: NewEarningData = {
  riderId: '',
  storeId: '',
  orderId: '',
  orderValue: 0,
  orderDate: new Date(),
  paymentStatus: 'pending',
  baseRate: 0,
  baseEarning: 0,
  distanceBonus: 0,
  timeBonus: 0,
  storeOfferBonus: 0,
  evBonus: 0,
  peakTimeBonus: 0,
  qualityBonus: 0,
  additionalBonus: 0,
}

const RiderEarnings: React.FC = () => {
  // State management
  const [riderId, setRiderId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [store, setStore] = useState('')
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [stores, setStores] = useState<Array<{ id: string; storeName: string }>>([])
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [newEarning, setNewEarning] = useState<NewEarningData>(defaultNewEarning)
  const [loading, setLoading] = useState(false)

  // Load stores on component mount
  useEffect(() => {
    loadStores()
  }, [])

  // Helper function to load stores
  const loadStores = async () => {
    try {
      const response = await clientStoreService.getStores({})
      if (response.success) {
        setStores(response.data)
      }
    } catch (error) {
      console.error('Error loading stores:', error)
    }
  }

  // Handle creating new earning
  const handleCreateEarning = async () => {
    if (!newEarning.riderId || !newEarning.storeId || !newEarning.orderId) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const earningData = {
        ...newEarning,
        orderDate: newEarning.orderDate.toISOString(),
      }

      const response = await clientStoreService.createRiderEarning(earningData)
      if (response.success) {
        setOpenAddDialog(false)
        setNewEarning(defaultNewEarning)
        // TODO: Refresh earnings data
      } else {
        alert('Failed to create earning: ' + response.message)
      }
    } catch (error) {
      console.error('Error creating earning:', error)
      alert('Failed to create earning. Please try again.')
    }
    setLoading(false)
  }

  // Stats data
  const stats = {
    totalEarnings: '₹0.00',
    paidEarnings: '₹0.00',
    pendingEarnings: '₹0.00',
    totalRecords: 0
  }

  return (
    <Box p={3}>
      {/* Header with title and actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5">Rider Earnings Management</Typography>
        <Box>
          <Button startIcon={<ExportIcon />} variant="outlined" color="primary" sx={{ mr: 2 }}>
            Export
          </Button>
          <Button startIcon={<RefreshIcon />} variant="outlined" color="primary" sx={{ mr: 2 }}>
            Refresh
          </Button>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            color="primary"
            onClick={() => setOpenAddDialog(true)}
          >
            Add Earning
          </Button>
        </Box>
      </Box>

      {/* Statistics cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Total Earnings</Typography>
            <Box display="flex" alignItems="center">
              <MoneyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">{stats.totalEarnings}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Paid Earnings</Typography>
            <Box display="flex" alignItems="center">
              <MoneyIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" color="success.main">{stats.paidEarnings}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Pending Earnings</Typography>
            <Box display="flex" alignItems="center">
              <MoneyIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" color="warning.main">{stats.pendingEarnings}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Total Records</Typography>
            <Box display="flex" alignItems="center">
              <AssignmentIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">{stats.totalRecords}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Rider ID"
              variant="outlined"
              value={riderId}
              onChange={(e) => setRiderId(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Payment Status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Store"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            >
              <MenuItem value="">All Stores</MenuItem>
              <MenuItem value="store1">Store 1</MenuItem>
              <MenuItem value="store2">Store 2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="Date From"
              value={dateFrom}
              onChange={(newValue) => setDateFrom(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="Date To"
              value={dateTo}
              onChange={(newValue) => setDateTo(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button variant="outlined" color="primary" fullWidth>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rider ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Base Earning</TableCell>
              <TableCell>Bonuses</TableCell>
              <TableCell>Penalties</TableCell>
              <TableCell>Total Earning</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} align="center">
                No rider earnings found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box p={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Typography variant="body2" color="text.secondary" mr={2}>
            Rows per page:
          </Typography>
          <TextField
            select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            size="small"
            sx={{ width: 80, mr: 2 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
          <Typography variant="body2" color="text.secondary">
            0-0 of 0
          </Typography>
        </Box>
      </TableContainer>

      {/* Add Earning Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
        keepMounted={false}
        disablePortal={false}
        aria-labelledby="add-earning-dialog-title"
      >
        <DialogTitle id="add-earning-dialog-title">Add New Rider Earning</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Rider ID *"
                value={newEarning.riderId}
                onChange={(e) => setNewEarning({ ...newEarning, riderId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Store *"
                value={newEarning.storeId}
                onChange={(e) => setNewEarning({ ...newEarning, storeId: e.target.value })}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.storeName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Order ID *"
                value={newEarning.orderId}
                onChange={(e) => setNewEarning({ ...newEarning, orderId: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Order Details</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Order Value"
                type="number"
                value={newEarning.orderValue}
                onChange={(e) => setNewEarning({ ...newEarning, orderValue: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Date *"
                value={newEarning.orderDate}
                onChange={(newValue) => setNewEarning({ ...newEarning, orderDate: newValue || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Payment Status *"
                value={newEarning.paymentStatus}
                onChange={(e) => setNewEarning({ ...newEarning, paymentStatus: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Earnings Breakdown</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Base Rate"
                type="number"
                value={newEarning.baseRate}
                onChange={(e) => setNewEarning({ ...newEarning, baseRate: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Base Earning *"
                type="number"
                value={newEarning.baseEarning}
                onChange={(e) => setNewEarning({ ...newEarning, baseEarning: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Distance Bonus"
                type="number"
                value={newEarning.distanceBonus}
                onChange={(e) => setNewEarning({ ...newEarning, distanceBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Time Bonus"
                type="number"
                value={newEarning.timeBonus}
                onChange={(e) => setNewEarning({ ...newEarning, timeBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Store Offer Bonus"
                type="number"
                value={newEarning.storeOfferBonus}
                onChange={(e) => setNewEarning({ ...newEarning, storeOfferBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="EV Bonus"
                type="number"
                value={newEarning.evBonus}
                onChange={(e) => setNewEarning({ ...newEarning, evBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Peak Time Bonus"
                type="number"
                value={newEarning.peakTimeBonus}
                onChange={(e) => setNewEarning({ ...newEarning, peakTimeBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quality Bonus"
                type="number"
                value={newEarning.qualityBonus}
                onChange={(e) => setNewEarning({ ...newEarning, qualityBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Additional Bonus"
                type="number"
                value={newEarning.additionalBonus}
                onChange={(e) => setNewEarning({ ...newEarning, additionalBonus: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEarning}
            disabled={loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RiderEarnings