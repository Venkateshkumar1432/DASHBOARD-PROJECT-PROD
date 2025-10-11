import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  styled
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  DeliveryDining as DeliveryIcon,
  PendingActions as PendingIcon,
  TaskAlt as CompletedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Import types
import { Order, OrderStatus as OriginalOrderStatus } from '../../types/order';

// ✅ Extend OrderStatus safely if CONFIRMED is missing
// (this avoids modifying your original enum file)
export const OrderStatus = {
  ...OriginalOrderStatus,
  CONFIRMED: (OriginalOrderStatus as any).CONFIRMED || 'CONFIRMED',
};

// Styled components for custom step styling
const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; error?: boolean; cancelled?: boolean };
}>(({ theme, ownerState }) => ({
  display: 'flex',
  height: 22,
  alignItems: 'center',
  color: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
      ? theme.palette.success.main
      : ownerState.error
        ? theme.palette.error.main
        : ownerState.cancelled
          ? theme.palette.error.light
          : theme.palette.text.disabled,
  '& .StepIcon-completedIcon': {
    color: theme.palette.success.main,
    zIndex: 1,
    fontSize: 24,
  },
  '& .StepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

interface OrderStepIconProps {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
  cancelled?: boolean;
  icon: React.ReactNode;
}

function OrderStepIcon({ active, completed, error, cancelled, icon }: OrderStepIconProps) {
  const ownerState = { active, completed, error, cancelled };
  const icons: { [key: string]: React.ReactNode } = {
    1: <PendingIcon />,
    2: <StoreIcon />,
    3: <ShippingIcon />,
    4: <DeliveryIcon />,
    5: <CompletedIcon />,
  };

  if (error) return <StepIconRoot ownerState={ownerState}><ErrorIcon color="error" /></StepIconRoot>;
  if (cancelled) return <StepIconRoot ownerState={ownerState}><CancelIcon color="error" /></StepIconRoot>;

  return (
    <StepIconRoot ownerState={ownerState}>
      {completed ? <CheckIcon className="StepIcon-completedIcon" /> : icons[String(icon)]}
    </StepIconRoot>
  );
}

// Map order status to step index
const getStepIndex = (status: string): number => {
  switch (status) {
    case OrderStatus.PENDING: return 0;
    case OrderStatus.CONFIRMED: return 1;
    case OrderStatus.PICKED_UP: return 2;
    case OrderStatus.IN_TRANSIT: return 3;
    case OrderStatus.DELIVERED: return 4;
    case OrderStatus.CANCELLED:
    case OrderStatus.FAILED: return -1;
    default: return 0;
  }
};

interface OrderTrackerProps {
  order: Order;
  statusHistory?: { id: string, to_status: string; created_at: string }[];
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order, statusHistory = [] }) => {
  const steps = ['Pending', 'Confirmed', 'Picked Up', 'In Transit', 'Delivered'];
  const currentStep = getStepIndex(order.status as string);

  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isFailed = order.status === OrderStatus.FAILED;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusTimestamp = (status: string) => {
    const historyItem = statusHistory.find(h => h.to_status === status);
    return historyItem ? formatDate(historyItem.created_at) : '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {(isCancelled || isFailed) && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: isCancelled ? '#FFEBEE' : '#FFF8E1',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isCancelled ? <CancelIcon color="error" sx={{ mr: 2 }} /> : <ErrorIcon color="warning" sx={{ mr: 2 }} />}
            <Box>
              <Typography variant="h6" color={isCancelled ? 'error' : 'warning.dark'}>
                {isCancelled ? 'Order Cancelled' : 'Order Failed'}
              </Typography>
              <Typography variant="body2">
                {String(('cancellation_reason' in order && order.cancellation_reason) || 'No reason provided')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {order.updated_at ? formatDate(order.updated_at) : ''}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = { completed: index < currentStep };
          const labelProps: { optional?: React.ReactNode } = {};
          const timestampMap: Record<number, string> = {
            0: OrderStatus.PENDING,
            1: OrderStatus.CONFIRMED,
            2: OrderStatus.PICKED_UP,
            3: OrderStatus.IN_TRANSIT,
            4: OrderStatus.DELIVERED,
          };
          const timestamp = getStatusTimestamp(timestampMap[index]);
          if (timestamp) labelProps.optional = <Typography variant="caption" color="text.secondary">{timestamp}</Typography>;

          return (
            <Step key={label} {...stepProps}>
              <StepLabel
                StepIconComponent={OrderStepIcon}
                // ✅ Don’t pass cancelled directly to StepIconProps
                StepIconProps={{
                  error: isFailed && index === currentStep,
                  active: index === currentStep,
                  completed: index < currentStep,
                  icon: index + 1,
                } as any}
                {...labelProps}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {currentStep === steps.length ? (
          <Typography variant="subtitle1" color="success.main">
            {`Order successfully delivered on ${formatDate('actual_delivery_time' in order ? String(order.actual_delivery_time) : '')}`}
          </Typography>
        ) : isCancelled ? (
          <Typography variant="subtitle1" color="error">Order was cancelled and will not proceed further</Typography>
        ) : isFailed ? (
          <Typography variant="subtitle1" color="warning.dark">Order delivery failed</Typography>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            {`Order is currently ${steps[currentStep].toLowerCase()}`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OrderTracker;
