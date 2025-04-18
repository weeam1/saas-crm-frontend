import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormLabel,
  Input,
  Button,
  Grid,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .positive('Amount must be positive'),
});

const AddIncomingPaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      type: '',
      description: '',
      amount: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onClose();
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" justifyContent="space-between">
          Add Office Expense
          <IconButton icon={<CloseIcon />} onClick={onClose} size="sm" />
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Grid templateColumns="1fr" gap={4}>
              <div>
                <FormLabel>Type</FormLabel>
                <Input
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  placeholder="e.g., Office expense"
                  focusBorderColor="brand.500"
                />
                {errors.type && touched.type && (
                  <p style={{ color: 'red' }}>{errors.type}</p>
                )}
              </div>
              <div>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="e.g., Office rent or utilities"
                  focusBorderColor="brand.500"
                />
                {errors.description && touched.description && (
                  <p style={{ color: 'red' }}>{errors.description}</p>
                )}
              </div>
              <div>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange}
                  placeholder="e.g., 5050"
                  focusBorderColor="brand.500"
                />
                {errors.amount && touched.amount && (
                  <p style={{ color: 'red' }}>{errors.amount}</p>
                )}
              </div>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" variant="brand">
              Add Expense
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddIncomingPaymentModal;
