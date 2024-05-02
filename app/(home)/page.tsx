import Header from "../_components/header";
import Search from "./_components/search";
import Welcome from "./_components/welcome";
import BookingItem from '../_components/booking-item';

export default function Home() {
  return (
    <div>
      <Header />

      <Welcome />

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs ml-2 mb-3 uppercase text-gray-400 text-bold">
          Agendamentos
        </h2>
        <BookingItem/>
      </div>
    </div>
  );
}
