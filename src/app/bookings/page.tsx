import BookingsList from "../components/BookingList";


const BookingPage: React.FC<{ params: { propertyId: string } }> = ({ params }) => {
  return (
    <div>
      <BookingsList/>
    </div>
  );
};

export default BookingPage;
