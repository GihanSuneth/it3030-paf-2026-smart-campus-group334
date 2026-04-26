import { Link, useParams } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'
import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

export function ResourceDetailsPage() {
  const { id } = useParams()
  const { data, loading, error } = useMockQuery(() => resourceApi.getResourceById(id), [id])

  if (loading) {
    return <LoadingState label="Loading resource details..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }// The ResourceDetailsPage component is responsible for displaying detailed information about a specific resource based on the resource ID obtained from the URL parameters. It uses the useMockQuery hook to fetch the resource data from the backend API using the resourceApi.getResourceById function. While the data is being fetched, a loading state is displayed, and if there is an error during the fetch operation, an error state is shown with the corresponding error message. Once the data is successfully retrieved, the component renders the resource details, including its description, type, location, status, code, and other relevant attributes based on its category (e.g., equipment, PC lab, lecture hall). The page also includes a link to book the resource and a back button to return to the resources list.

  const resource = data
  const isEquipment = getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.EQUIPMENT

  const detailRows = isEquipment
    ? [
        ['Asset ID', resource.assetId || 'Generated on save'],
        ['Inventory Type', resource.stockType || 'STANDARD'],
        ['Assigned To', resource.assignedTo || resource.location],
        ['Service Order', resource.serviceOrder || 'Not set'],
      ]// The detailRows variable is constructed based on whether the resource falls under the equipment category. If it is an equipment resource, the detailRows array includes specific attributes such as Asset ID, Inventory Type, Assigned To, and Service Order, with fallback values provided for any missing information. For non-equipment resources, the detailRows array is built based on the resource type (e.g., PC Lab or Lecture Hall) and includes relevant attributes such as capacity, number of working projectors, smart boards, sound systems, etc., with default values of 0 for any undefined attributes. This allows the ResourceDetailsPage to display a comprehensive set of details tailored to the specific type and category of the resource being viewed.
    : resource.type === 'PC Lab'
      ? [
          ['Capacity', resource.capacity],
          ['Total PCs', resource.totalPcs ?? 0],
          ['Working PCs', resource.workingPcs ?? 0],
          ['Smart Boards', `${resource.workingSmartBoards ?? 0}/${resource.smartBoardCount ?? 0} working`],
          ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
          ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
        ]
      : resource.type === 'Lecture Hall'
        ? [
            ['Seats', resource.capacity],
            ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
            ['Screens', `${resource.workingScreens ?? 0}/${resource.screenCount ?? 0} working`],
            ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
          ]
        : [
            ['Capacity', resource.capacity],
            ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
            ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
          ]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Resource Details"
        title={resource.name}
        description="Use the details below to confirm the resource matches your booking needs."
        actions={
          <Link
            className="btn-primary"
            to={`/bookings/new?resourceId=${resource.id}&bookingType=${resource.category}`}
          >
            Book Resource
          </Link>
        }
      />// The PageHeader component is used to display the header section of the Resource Details page, which includes an eyebrow text indicating that this is a resource details page, the title of the resource being viewed, a description providing context for the user, and an action button that allows the user to book the resource. The action button is a Link component that navigates to the booking creation page with query parameters for the resource ID and booking type, enabling users to easily initiate a booking for the specific resource they are viewing.

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_22rem]">
        <article className="panel space-y-4">
          <p className="text-base text-slate-600">{resource.description}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Type</p>
              <p className="mt-1 text-sm text-slate-500">{resource.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Location</p>
              <p className="mt-1 text-sm text-slate-500">{resource.location}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Status</p>
              <p className="mt-1 text-sm text-slate-500">{resource.status}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Code</p>
              <p className="mt-1 text-sm text-slate-500">{resource.code}</p>
            </div>
            {detailRows.map(([label, value]) => (
              <div key={label}>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{value}</p>
              </div>
            ))}
          </div>
        </article>// The first article element displays the main details of the resource, including its description, type, location, status, code, and additional attributes based on its category. The details are organized in a grid layout for better readability, with labels and corresponding values clearly presented to the user.

        <article className="panel space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Availability</h2>
          <p className="text-sm text-slate-500">
            {resource.available ? 'This resource is currently available for booking or use.' : 'This resource is currently unavailable.'}
          </p>
          <p className="text-sm text-slate-500">
            Resource code: {resource.code}
          </p>
          <Link className="btn-ghost w-full justify-center" to="/resources">
            Back to Resources
          </Link>
        </article>
      </section>
    </PageContainer>
  )
}
