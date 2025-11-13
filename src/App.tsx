import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import WeatherForecast from "./pages/Weather/WeatherForecast";
import PrivateRoute from "./components/privateroute/PrivateRoute";

// CUSTOMERS
import CustomersList from "./pages/Customers/CustomersList";
import CustomerEdit from "./pages/Customers/CustomerEdit";
import CustomerCreate from "./pages/Customers/CustomerCreate";
import CustomerDetail from "./pages/Customers/CustomerDetail";

// EVENTS
import EventCreate from "./pages/Events/EventCreate";
import EventEdit from "./pages/Events/EventEdit";
import EventDetail from "./pages/Events/EventDetail";
import EventsList from "./pages/Events/EventsList";

// LOCATIONS
import LocationsList from "./pages/Locations/LocationsList";
import LocationCreate from "./pages/Locations/LocationCreate";
import LocationEdit from "./pages/Locations/LocationEdit";
import LocationDetail from "./pages/Locations/LocationDetail";

// OFFERS
import OffersList from "./pages/Offers/OffersList";
import OfferCreate from "./pages/Offers/OfferCreate.tsx";
import OfferEdit from "./pages/Offers/OfferEdit";
import OfferView from "./pages/Offers/OfferView.tsx";

// PACKAGES
import PackagesList from "./pages/Packages/PackagesList";
import PackageCreate from "./pages/Packages/PackageCreate.tsx";
import PackageEdit from "./pages/Packages/PackageEdit";
import PackageView from "./pages/Packages/PackageView";
import PricelistsList from "./pages/Pricelists/PricelistsList.tsx";
import PricelistCreate from "./pages/Pricelists/PricelistCreate.tsx";
import PricelistDetail from "./pages/Pricelists/PricelistDetail.tsx";
import PricelistEdit from "./pages/Pricelists/PricelistEdit.tsx";

export default function App() {
  return (
    <>
      <ScrollToTop />

      {/* Public Auth Routes */}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
          <Route path="weather" element={<WeatherForecast />} />

          {/* CUSTOMERS */}
          <Route path="customers" element={<CustomersList />} />
          <Route path="customers/new" element={<CustomerCreate />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/:id/edit" element={<CustomerEdit />} />

          {/* EVENTS */}
          <Route path="events" element={<EventsList />} />
          <Route path="events/new" element={<EventCreate />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events/:id/edit" element={<EventEdit />} />

          {/* LOCATIONS */}
          <Route path="locations" element={<LocationsList />} />
          <Route path="locations/new" element={<LocationCreate />} />
          <Route path="locations/:id" element={<LocationDetail />} />
          <Route path="locations/:id/edit" element={<LocationEdit />} />

          {/* OFFERS */}
          <Route path="offers" element={<OffersList />} />
          <Route path="offers/new" element={<OfferCreate />} />
          <Route path="offers/:id" element={<OfferView />} />
          <Route path="offers/:id/edit" element={<OfferEdit />} />

          {/* PACKAGES */}
          <Route path="packages" element={<PackagesList />} />
          <Route path="packages/new" element={<PackageCreate />} />
          <Route path="packages/:id" element={<PackageView />} />
          <Route path="packages/:id/edit" element={<PackageEdit />} />

        <Route path="pricelists" element={<PricelistsList />} />
        <Route path="pricelists/new" element={<PricelistCreate />} />
        <Route path="pricelists/:id" element={<PricelistDetail />} />
        <Route path="pricelists/:id/edit" element={<PricelistEdit />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
