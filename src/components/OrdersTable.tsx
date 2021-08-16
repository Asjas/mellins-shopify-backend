import { Card, DataTable, Badge, Pagination } from "@shopify/polaris";
import { format } from "date-fns";

import LinkButton from "./LinkButton";

const calculateDefaultValues = (metafields) => {
  if (metafields.edges.length === 0) return null;

  const metafieldObject = metafields.edges.reduce((accum, currentValue) => {
    const { key, value } = currentValue.node;

    accum[key] = value;

    return accum;
  }, {});

  return metafieldObject;
};

const orderStatusColumn = (tableRow) => {
  const { metafields } = tableRow?.node;

  const orderReadyStatus =
    metafields &&
    metafields.edges.map((metafield) => {
      if (metafield?.node?.key === "orderStatus") {
        return metafield.node.value;
      }

      return null;
    });

  const awaitingEyeTest =
    metafields &&
    metafields.edges.map((metafield) => {
      if (metafield?.node?.key === "awaitingEyeTest") {
        return metafield.node.value;
      }

      return null;
    });

  if (awaitingEyeTest.includes("Yes")) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="partiallyComplete" status="warning">
        Awaiting eye test
      </Badge>
    );

    return statusBadge;
  }

  if (orderReadyStatus.includes("Ready") || orderReadyStatus.includes("Ready for pickup")) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="complete" status="success">
        Ready for pickup
      </Badge>
    );

    return statusBadge;
  }

  if (orderReadyStatus.includes("Shipping on hold")) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="partiallyComplete" status="info">
        Shipping on hold
      </Badge>
    );

    return statusBadge;
  }

  if (orderReadyStatus.includes("Cancel shipping")) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="complete" status="info">
        Cancel shipping
      </Badge>
    );

    return statusBadge;
  }

  if (orderReadyStatus.includes("Awaiting Delivery")) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="partiallyComplete" status="info">
        Awaiting delivery
      </Badge>
    );

    return statusBadge;
  }

  if (
    metafields?.edges.length > 0 &&
    !orderReadyStatus.includes("Ready") &&
    !orderReadyStatus.includes("Awaiting delivery")
  ) {
    const statusBadge = (
      // @ts-ignore
      <Badge progress="partiallyComplete" status="attention">
        In progress
      </Badge>
    );

    return statusBadge;
  }

  const status = {
    status: "new",
    progress: "incomplete",
    text: "Needs review",
  };

  const statusBadge = (
    // @ts-ignore
    <Badge progress={status.progress} status={status.status}>
      {status.text}
    </Badge>
  );

  return statusBadge;
};

const shippingSupplierColumn = (tableRow) => {
  const { metafields } = tableRow?.node;

  const metafieldObject = calculateDefaultValues(metafields);

  return metafieldObject?.shippingSupplier;
};

const approvedByColumn = (tableRow) => {
  const { metafields } = tableRow?.node;

  const metafieldObject = calculateDefaultValues(metafields);

  return metafieldObject?.optomName;
};

const orderReferenceColumn = (tableRow) => {
  const { metafields } = tableRow?.node;

  const metafieldObject = calculateDefaultValues(metafields);

  return metafieldObject?.orderReference;
};

export default function ContactLensOrdersTable({
  tableData,
  hasPreviousPage,
  navigatePreviousPage,
  hasNextPage,
  navigateNextPage,
}) {
  const rows = tableData.map((tableRow) => {
    const rowData = [];
    const date = format(new Date(tableRow?.node?.createdAt), "dd MMMM yyyy");
    const orderId = tableRow?.node?.id?.replace("gid://shopify/Order/", "");
    const link = <LinkButton linkTo={`/contact-lens/${orderId}`}>Review Order</LinkButton>;

    rowData.push(
      date,
      tableRow?.node?.customer?.firstName,
      tableRow?.node?.customer?.lastName,
      tableRow?.node?.customer?.addresses[0]?.province,
      tableRow?.node?.name,
      orderReferenceColumn(tableRow),
      orderStatusColumn(tableRow),
      shippingSupplierColumn(tableRow),
      approvedByColumn(tableRow),
      link,
    );

    return rowData;
  });

  function FooterPagination() {
    return (
      <Pagination
        label={`Showing ${rows.length} results`}
        hasPrevious={hasPreviousPage}
        previousTooltip="Show previous orders"
        onPrevious={() => {
          navigatePreviousPage();
        }}
        hasNext={hasNextPage}
        nextTooltip="Show next orders"
        onNext={() => {
          navigateNextPage();
        }}
      />
    );
  }

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text", "text", "text", "text", "text", "text"]}
        headings={[
          "Order Date",
          "Name",
          "Surname",
          "Province",
          "Order ID",
          "Order Reference",
          "Order Status",
          "Shipping Supplier",
          "Approved By",
          "Verify Order",
        ]}
        rows={rows}
        footerContent={<FooterPagination />}
      />
    </Card>
  );
}
