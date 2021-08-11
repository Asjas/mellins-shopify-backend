import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  const { control, handleSubmit, errors, formState, watch } = useForm({ defaultValues });
  const { isDirty } = formState;
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
            render={(props) => (
              <BranchNameField {...props} error={errors?.branchName && "Branch name field is required"} />
            )}
            name="branchName"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={(props) => (
              <AccountNumberField {...props} error={errors?.accountNumber && "Account number field is required"} />
            )}
            name="accountNumber"
            control={control}
            rules={{ required: true }}
          />
          <Controller
            render={(props) => (
              <ShippingSupplierField
                {...props}
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
            render={(props) => <LastExaminationDateField {...props} />}
            name="lastExaminationDate"
            control={control}
          />
          <Controller
            render={(props) => <NextExaminationDateField {...props} />}
            name="nextExaminationDate"
            control={control}
          />
          <Controller
            render={(props) => <LastPurchaseDateField {...props} />}
            name="lastPurchaseDate"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={(props) => <InfectionHistoryField {...props} />}
            name="infectionHistory"
            control={control}
          />
          <Controller render={(props) => <RiskCategoryField {...props} />} name="riskCategory" control={control} />
          <Controller
            render={(props) => <ProductVerifiedField {...props} />}
            name="productVerified"
            control={control}
          />
          <Controller
            render={(props) => <PrescriptionVerifiedField {...props} />}
            name="prescriptionVerified"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={(props) => <DateOfPhonecallField {...props} />}
            name="dateOfPhonecall"
            control={control}
          />
          <Controller
            render={(props) => <TimeOfPhonecallField {...props} />}
            name="timeOfPhonecall"
            control={control}
          />
          <Controller
            render={(props) => <NotesOfPhonecallField {...props} />}
            name="notesOfPhonecall"
            control={control}
          />
          <Controller
            render={(props) => <PxArrangementField {...props} />}
            name="patientArrangement"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller render={(props) => <OrderReferenceField {...props} />} name="orderReference" control={control} />
          <Controller render={(props) => <IBTRequested {...props} />} name="ibtRequested" control={control} />
          <Controller render={(props) => <TagNumbersForIBTField {...props} />} name="tagNumbersIBT" control={control} />
          <Controller render={(props) => <IBTReferenceField {...props} />} name="IBTreference" control={control} />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller render={(props) => <EyeTestVoucherField {...props} />} name="eyeTestVoucher" control={control} />
          <Controller
            render={(props) => <VoucherReferenceField {...props} />}
            name="voucherReference"
            control={control}
          />
          <Controller
            render={(props) => <AwaitingEyeTestField {...props} />}
            name="awaitingEyeTest"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={(props) => <RefundRequestedField {...props} />}
            name="refundRequested"
            control={control}
          />
          <Controller render={(props) => <RefundAmountField {...props} />} name="refundAmount" control={control} />
          <Controller
            render={(props) => <RefundReferenceField {...props} />}
            name="refundReference"
            control={control}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Controller
            render={(props) => (
              <OptomNameField {...props} error={errors?.optomName && "Optom name field is required"} />
            )}
            name="optomName"
            control={control}
            rules={{ required: true }}
          />
          <Controller render={(props) => <OrderApprovedField {...props} />} name="orderApproved" control={control} />
          <Controller render={(props) => <OrderReadyStatusField {...props} />} name="orderStatus" control={control} />
        </FormLayout.Group>
      </FormLayout>
      <button className="hidden" id="submit" type="submit" ref={formSubmitRef}>
        Submit
      </button>
    </Form>
  );
}
