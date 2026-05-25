// Email routing based on intake_options.

export function getIntakeOptions(listing) {
  const raw = listing.intake_options;
  if (raw && typeof raw === "object") return raw;
  return {};
}

export function getNotificationEmail(listing) {
  const opts = getIntakeOptions(listing);
  if (opts.showing_management === "point_person" && opts.point_person?.email) {
    return opts.point_person.email;
  }
  return listing.contact_email;
}

export function shouldEmailOwner(listing) {
  const opts = getIntakeOptions(listing);
  const delivery = opts.inquiry_delivery;
  if (delivery === "airtable") return false;
  return true;
}

export function intakeSummaryLabels(opts = {}) {
  const showing =
    opts.showing_management === "swft"
      ? "SWFT manages showings"
      : opts.showing_management === "point_person"
        ? `Point person: ${opts.point_person?.name || "Realtor/PM"}`
        : "Owner manages showings";
  const inquiries =
    opts.inquiry_delivery === "airtable"
      ? "SWFT Airtable + dashboard"
      : opts.inquiry_delivery === "email_and_csv"
        ? "Email + CSV export"
        : "Direct to your email";
  const listing =
    opts.listing_management === "swft" ? "SWFT-managed listing" : "Self-managed listing";
  return { showing, inquiries, listing };
}
