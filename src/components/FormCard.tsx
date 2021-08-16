import { useEffect } from "react";
import { useForm, Controller, useFormState } from "react-hook-form";
import { Form, FormLayout, TextField, Select } from "@shopify/polaris";
import isEqual from "lodash.isequal";

function BranchNameField(props) {
  return <TextField label="Branch name" type="text" {...props} />;
}

function AccountNumberField(props) {
  return <TextField label="Account number" type="text" {...props} />;
}

function ShippingSupplierField(props) {
  return <TextField label="Shipping supplier" type="text" {...props} />;
}

function LastExaminationDateField(props) {
  return <TextField label="Last examination date" type="date" {...props} />;
}

function NextExaminationDateField(props) {
  return <TextField label="Next examination date" type="date" {...props} />;
}

function LastPurchaseDateField(props) {
  return <TextField label="Last purchase date" type="date" {...props} />;
}

function InfectionHistoryField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Incomplete Data", value: "Incomplete Data" },
  ];

  return <Select label="History of infection/non-compliance" options={options} placeholder="Select" {...props} />;
}

function RiskCategoryField(props) {
  const options = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  return <Select label="Risk category" options={options} placeholder="Select" {...props} />;
}

function ProductVerifiedField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Product & BC verified" options={options} placeholder="Select" {...props} />;
}

function PrescriptionVerifiedField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Prescription verified" options={options} placeholder="Select" {...props} />;
}

function DateOfPhonecallField(props) {
  return <TextField label="Date of phonecall" type="date" {...props} />;
}

function TimeOfPhonecallField(props) {
  return <TextField label="Time of phonecall" type="time" {...props} />;
}

function NotesOfPhonecallField(props) {
  return <TextField label="Notes of phonecall" type="text" maxLength={280} multiline={true} {...props} />;
}

function OrderReferenceField(props) {
  return <TextField label="Order reference number" type="text" maxLength={280} {...props} />;
}

function IBTRequested(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="IBT Requested" options={options} placeholder="Select" {...props} />;
}

function TagNumbersForIBTField(props) {
  return <TextField label="Tag numbers for IBT" type="text" maxLength={280} {...props} />;
}

function IBTReferenceField(props) {
  return <TextField label="IBT reference number" type="text" maxLength={280} {...props} />;
}

function PxArrangementField(props) {
  return <TextField label="Arrangement with px" type="text" maxLength={280} {...props} />;
}

function EyeTestVoucherField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Eye test voucher requested" options={options} placeholder="Select" {...props} />;
}

function VoucherReferenceField(props) {
  return <TextField label="Voucher reference number" type="text" maxLength={280} {...props} />;
}

function AwaitingEyeTestField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Awaiting eye test" options={options} placeholder="Select" {...props} />;
}

function RefundRequestedField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Refund requested" options={options} placeholder="Select" {...props} />;
}

function RefundAmountField(props) {
  return <TextField label="Refund amount" type="text" maxLength={280} {...props} />;
}

function RefundReferenceField(props) {
  return <TextField label="Refund reference number" type="text" maxLength={280} {...props} />;
}

function OptomNameField(props) {
  const options = [
    { label: "Andre Horn", value: "Andre Horn" },
    { label: "Bernardine Flynn", value: "Bernardine Flynn" },
    { label: "Inge Loubser", value: "Inge Loubser" },
    { label: "Rudine Diedericks", value: "Rudine Diedericks" },
  ];

  return <Select label="Optometrist name" options={options} placeholder="Select" {...props} />;
}

function OrderApprovedField(props) {
  const options = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  return <Select label="Order approved" options={options} placeholder="Select" {...props} />;
}

function OrderReadyStatusField(props) {
  const options = [
    { label: "Awaiting delivery", value: "Awaiting Delivery" },
    { label: "Ready for pickup", value: "Ready for pickup" },
    { label: "Shipping on hold", value: "Shipping on hold" },
    { label: "Cancel shipping", value: "Cancel shipping" },
  ];

  return <Select label="Order ready status" options={options} placeholder="Select" {...props} />;
}

export default function FormCard({ setDirty, handleFormSubmit, setFormData, formData, defaultValues, formSubmitRef }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });
  const { isDirty } = useFormState({ control });
  const watchedValues = watch();

  useEffect(() => {
    setDirty(isDirty);

    if (isEqual(formData, watchedValues)) return;

    setFormData(watchedValues);
  }, [isDirty, watchedValues]);

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} preventDefault={true}>
      <FormLayout>
        <FormLayout.Group>
          <Controller
            render={({ field }) => (
              <BranchNameField {...field} error={errors?.branchName && "Branch name field is required"} />
            )}
            name="branchName"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={({ field }) => (
              <AccountNumberField {...field} error={errors?.accountNumber && "Account number field is required"} />
            )}
            name="accountNumber"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={({ field }) => (
              <ShippingSupplierField
                {...field}
                error={errors?.shippingSupplier && "Shipping supplier field is required (Moscon, Fourways, etc.)"}
              />
            )}
            name="shippingSupplier"
            control={control}
            rules={{ required: true }}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <LastExaminationDateField {...field} />}
            name="lastExaminationDate"
            control={control}
          />
          <Controller
            render={({ field }) => <NextExaminationDateField {...field} />}
            name="nextExaminationDate"
            control={control}
          />
          <Controller
            render={({ field }) => <LastPurchaseDateField {...field} />}
            name="lastPurchaseDate"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <InfectionHistoryField {...field} />}
            name="infectionHistory"
            control={control}
          />
          <Controller render={({ field }) => <RiskCategoryField {...field} />} name="riskCategory" control={control} />
          <Controller
            render={({ field }) => <ProductVerifiedField {...field} />}
            name="productVerified"
            control={control}
          />
          <Controller
            render={({ field }) => <PrescriptionVerifiedField {...field} />}
            name="prescriptionVerified"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <DateOfPhonecallField {...field} />}
            name="dateOfPhonecall"
            control={control}
          />
          <Controller
            render={({ field }) => <TimeOfPhonecallField {...field} />}
            name="timeOfPhonecall"
            control={control}
          />
          <Controller
            render={({ field }) => <NotesOfPhonecallField {...field} />}
            name="notesOfPhonecall"
            control={control}
          />
          <Controller
            render={({ field }) => <PxArrangementField {...field} />}
            name="patientArrangement"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <OrderReferenceField {...field} />}
            name="orderReference"
            control={control}
          />
          <Controller render={({ field }) => <IBTRequested {...field} />} name="ibtRequested" control={control} />
          <Controller
            render={({ field }) => <TagNumbersForIBTField {...field} />}
            name="tagNumbersIBT"
            control={control}
          />
          <Controller render={({ field }) => <IBTReferenceField {...field} />} name="IBTreference" control={control} />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <EyeTestVoucherField {...field} />}
            name="eyeTestVoucher"
            control={control}
          />
          <Controller
            render={({ field }) => <VoucherReferenceField {...field} />}
            name="voucherReference"
            control={control}
          />
          <Controller
            render={({ field }) => <AwaitingEyeTestField {...field} />}
            name="awaitingEyeTest"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => <RefundRequestedField {...field} />}
            name="refundRequested"
            control={control}
          />
          <Controller render={({ field }) => <RefundAmountField {...field} />} name="refundAmount" control={control} />
          <Controller
            render={({ field }) => <RefundReferenceField {...field} />}
            name="refundReference"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={({ field }) => (
              <OptomNameField {...field} error={errors?.optomName && "Optom name field is required"} />
            )}
            name="optomName"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={({ field }) => <OrderApprovedField {...field} />}
            name="orderApproved"
            control={control}
          />
          <Controller
            render={({ field }) => <OrderReadyStatusField {...field} />}
            name="orderStatus"
            control={control}
          />
        </FormLayout.Group>
      </FormLayout>
      <button className="hidden" id="submit" type="submit" ref={formSubmitRef}>
        Submit
      </button>
    </Form>
  );
}
