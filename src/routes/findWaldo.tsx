import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

export const Route = createFileRoute('/findWaldo')({
  component: RouteComponent,
});

function RouteComponent() {
  function handleScanResult(result: IDetectedBarcode[]) {
    console.log(result);
  }

  return (
    <>
      <div className="h-dvh w-full flex flex-col">
        <div className="w-full flex-1 bg-white flex h-50">
          <img
            src="https://picsum.photos/300"
            className="object-cover flex-1"
          />
        </div>
        <div className="w-full flex-1 bg-black h-50">
          <Scanner onScan={(result) => handleScanResult(result)} />
        </div>

        <div className="absolute flex gap-2">
          <Link to="/askWaldo">
            <Button type="submit">Found waldo</Button>
          </Link>
          <Link to="/chooseWaldo">
            <Button type="button">Go Back</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
