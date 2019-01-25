# Generated by Django 2.1.4 on 2019-01-25 04:16

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('calc', '0004_auto_20181218_1837'),
    ]

    operations = [
        migrations.CreateModel(
            name='NodeResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='noderun',
            name='result',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='fk_node_run', to='calc.NodeResult'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='noderesult',
            name='node_run',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fk_node_run', to='calc.NodeRun'),
        ),
    ]
