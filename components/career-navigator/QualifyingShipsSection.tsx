'use client';

import React from 'react';
import { Ship } from '@/types/career-navigator';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ship as ShipIcon, ArrowRight } from 'lucide-react';
import { getShipHelpText, groupShipsByClass } from '@/lib/career-navigator/ship-matcher';

interface QualifyingShipsSectionProps {
  ships: Ship[];
  title?: string;
}

/**
 * Display ships that help build qualifying time
 */
export function QualifyingShipsSection({ ships, title = 'Ships That Build Qualifying Time' }: QualifyingShipsSectionProps) {
  if (ships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No ships currently in database. Check back soon!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const grouped = groupShipsByClass(ships);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShipIcon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          These vessels meet the tonnage and route requirements for your upgrade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).map(([shipClass, classShips]) => (
          <div key={shipClass}>
            <h4 className="font-semibold mb-3">
              {shipClass} Class ({classShips.length} {classShips.length === 1 ? 'ship' : 'ships'})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classShips.map(ship => (
                <div key={ship.id} className="border rounded-lg p-3 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{ship.name}</div>
                      {ship.hull_number && (
                        <div className="text-xs text-muted-foreground">{ship.hull_number}</div>
                      )}
                    </div>
                    {ship.operator && (
                      <Badge variant="outline" className="text-xs">
                        {ship.operator.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ship.grt && (
                      <Badge variant="secondary" className="text-xs">
                        {ship.grt.toLocaleString()} GRT
                      </Badge>
                    )}
                    {ship.route_category && (
                      <Badge variant="secondary" className="text-xs">
                        {ship.route_category}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {getShipHelpText(ship)}
                  </p>

                  <Link href={ship.slug}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Ship Page
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}