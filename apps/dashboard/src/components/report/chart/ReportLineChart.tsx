'use client';

import React from 'react';
import { useFormatDateInterval } from '@/hooks/useFormatDateInterval';
import { useNumber } from '@/hooks/useNumerFormatter';
import { useRechartDataModel } from '@/hooks/useRechartDataModel';
import { useVisibleSeries } from '@/hooks/useVisibleSeries';
import type { IChartData } from '@/trpc/client';
import { getChartColor } from '@/utils/theme';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { IServiceReference } from '@openpanel/db';
import type { IChartLineType, IInterval } from '@openpanel/validation';

import { getYAxisWidth } from './chart-utils';
import { useChartContext } from './ChartProvider';
import { ReportChartTooltip } from './ReportChartTooltip';
import { ReportTable } from './ReportTable';
import { ResponsiveContainer } from './ResponsiveContainer';

interface ReportLineChartProps {
  data: IChartData;
  references: IServiceReference[];
  interval: IInterval;
  lineType: IChartLineType;
}

export function ReportLineChart({
  lineType,
  interval,
  data,
  references,
}: ReportLineChartProps) {
  const { editMode, previous } = useChartContext();
  const formatDate = useFormatDateInterval(interval);
  const { series, setVisibleSeries } = useVisibleSeries(data);
  const rechartData = useRechartDataModel(series);
  const number = useNumber();

  return (
    <>
      <ResponsiveContainer>
        {({ width, height }) => (
          <LineChart width={width} height={height} data={rechartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              className="stroke-def-200"
            />
            {references.map((ref) => (
              <ReferenceLine
                key={ref.id}
                x={ref.date.getTime()}
                stroke={'#94a3b8'}
                strokeDasharray={'3 3'}
                label={{
                  value: ref.title,
                  position: 'centerTop',
                  fill: '#334155',
                  fontSize: 12,
                }}
                fontSize={10}
              />
            ))}
            <YAxis
              width={getYAxisWidth(data.metrics.max)}
              fontSize={12}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={number.short}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Tooltip content={<ReportChartTooltip />} />
            <XAxis
              axisLine={false}
              fontSize={12}
              dataKey="timestamp"
              scale="utc"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(m: string) => formatDate(new Date(m))}
              type="number"
              tickLine={false}
            />
            {series.map((serie) => {
              return (
                <React.Fragment key={serie.name}>
                  <Line
                    dot={false}
                    type={lineType}
                    key={serie.name}
                    name={serie.name}
                    isAnimationActive={false}
                    strokeWidth={2}
                    dataKey={`${serie.id}:count`}
                    stroke={getChartColor(serie.index)}
                  />
                  {previous && (
                    <Line
                      type={lineType}
                      key={`${serie.name}:prev`}
                      name={`${serie.name}:prev`}
                      isAnimationActive={false}
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray={'6 6'}
                      dataKey={`${serie.id}:prev:count`}
                      stroke={getChartColor(serie.index)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </LineChart>
        )}
      </ResponsiveContainer>
      {editMode && (
        <ReportTable
          data={data}
          visibleSeries={series}
          setVisibleSeries={setVisibleSeries}
        />
      )}
    </>
  );
}
