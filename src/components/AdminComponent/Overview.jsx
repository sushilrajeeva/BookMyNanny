import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function Overview() {
  return (
    <div>
      <div>Overview</div>
      <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Unverified Nannies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">20</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Verified Nannies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">100</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">400</p>
              </CardContent>
            </Card>
          </div>
    </div>
  )
}

export default Overview